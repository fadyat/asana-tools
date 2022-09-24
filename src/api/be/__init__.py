import json
import typing

from fastapi import APIRouter, Form, File, UploadFile
from fastapi.responses import JSONResponse

from src import typedef
from src.clients.asana.client import AsyncAsanaClient
from src.clients.asana.filters.projects import get_project_gid
from src.clients.asana.filters.tasks import (
    get_task_gid,
    filter_tasks_by_complete_status,
    filter_tasks_by_creator,
)
from src.clients.asana.handlers.projects import process_members_response
from src.clients.asana.handlers.tasks import (
    process_task_response,
    process_multiple_tasks_creation,
    process_tasks_response,
)
from src.config.asana import AsanaTaskConfig
from src.entities import TaskPermanentLink, AsanaTaskBasicObject
from src.utils.io import csv_file_to_dataframe

be_router = APIRouter(
    prefix='/api/v1',
    tags=['backend'],
)


# todo: move another file


@be_router.post(
    path='/tasks/by_template',
    response_class=JSONResponse,
    responses={
        200: {
            'description': 'Successful response',
            'content': {
                'application/json': {
                    'example': {
                        'assignee': 'artyom fadeev',
                        'task_url': 'https://app.asana.com/0/1234567890/1234567890',
                    },
                },
            },
        },
    },
)
async def create_multiple_tasks_form(
    request: typedef.Request,
    asana_api_key: str = Form(...),
    asana_template_url: str = Form(...),
    uploaded_file: UploadFile = File(...),
) -> typing.Sequence[TaskPermanentLink]:
    logs = request.app.logger
    logs.info('Start creating mailing tasks')
    task_gid = get_task_gid(asana_template_url)
    project_gid = get_project_gid(asana_template_url)
    asana_api_endpoint = request.app.asana_config.asana_api_endpoint

    async with AsyncAsanaClient(asana_api_key, asana_api_endpoint) as client:
        members_data = await process_members_response(project_gid, client)
        task_data = await process_task_response(task_gid, client)

    dataframe = csv_file_to_dataframe(uploaded_file.file)
    task_config = AsanaTaskConfig(
        name=task_data.get('name'),
        notes=task_data.get('notes'),
        project_gid=project_gid,
    )

    async with AsyncAsanaClient(asana_api_key, asana_api_endpoint) as client:
        permanent_links_for_users = await process_multiple_tasks_creation(
            dataframe=dataframe,
            asana_client=client,
            members=members_data,
            task_config=task_config,
            logs=logs,
        )

    logs.info('Finish creating mailing tasks')
    return permanent_links_for_users


@be_router.get(  # todo: is this endpoint needed?
    path='/tasks/contractor',
    response_class=JSONResponse,
)
async def get_completed_contractor_tasks(
    request: typedef.Request,
    asana_api_key: str = Form(...),
    contractor_email: str = Form(...),
    contractor_project: str = Form(...),
    # completed_since: str = Form(...), todo: add to form
):
    project_gid = get_project_gid(contractor_project)
    asana_api_endpoint = request.app.asana_config.asana_api_endpoint
    completed_since = '2022-09-10'  # todo add to form

    opt_fields = (  # todo: move to another file
        'name',
        'completed',
        'completed_at',
        'name',
        'created_by',
        'created_by.name',
        'created_by.email',
        'followers',
        'followers.name',
    )

    async with AsyncAsanaClient(asana_api_key, asana_api_endpoint) as client:
        # completed and uncompleted tasks after `completed_since` value
        all_tasks = await process_tasks_response(
            project_gid=project_gid,
            asana_client=client,
            completed_since=completed_since,
            opt_fields=opt_fields,
        )

    completed_tasks = filter_tasks_by_complete_status(all_tasks)
    contractor_tasks = filter_tasks_by_creator(completed_tasks, contractor_email)

    return contractor_tasks


@be_router.post(
    path='/tasks/contractor/report',
    response_class=JSONResponse,
)
async def report_completed_contractor_tasks(
    request: typedef.Request,
    asana_api_key: str = Form(...),
    contractor_email: str = Form(...),
    contractor_project: str = Form(...),
    # completed_since: str = Form(...), todo: add to form
):
    project_gid = get_project_gid(contractor_project)
    asana_api_endpoint = request.app.asana_config.asana_api_endpoint
    completed_since = '2022-09-10'  # todo: from form

    contractor_tasks = await get_completed_contractor_tasks(
        request=request,
        asana_api_key=asana_api_key,
        contractor_email=contractor_email,
        contractor_project=contractor_project,
        # completed_since=completed_since, # todo: from form
    )

    async with AsyncAsanaClient(asana_api_key, asana_api_endpoint) as client:
        agreement_project_members = await process_members_response(
            project_gid=project_gid,
            asana_client=client,
        )

        main_task = await client.tasks.create_task(
            AsanaTaskBasicObject(  # todo: move to process
                name=f'Report for {contractor_email}',
                projects=[project_gid],
                notes=json.dumps(contractor_tasks),  # todo: make beautiful
                followers=[
                    (member.get('user') or {}).get('gid')
                    for member in agreement_project_members
                ],
            )
        )

        main_task_gid = main_task.get('data').get('gid')
        subtasks = []
        for coordinator in agreement_project_members:
            coordinator = coordinator.get('user')
            subtask = await client.tasks.create_subtask(
                parent_task_gid=main_task_gid,
                asana_task_basic_object=AsanaTaskBasicObject(
                    assignee=coordinator.get('gid'),
                    approval_status='pending',
                    name=f'Agreement for {coordinator.get("name")}',
                    notes=coordinator.get('email'),
                ),
            )
            subtasks.append(subtask)

    return subtasks