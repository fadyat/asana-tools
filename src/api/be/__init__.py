import typing

from fastapi import APIRouter, Form, UploadFile

from src import typedef
from src.clients.asana.client import AsyncAsanaClient
from src.clients.asana.filters.projects import get_project_gid
from src.clients.asana.filters.tasks import (
    get_task_gid,
    filter_tasks_by_complete_status,
    filter_tasks_by_completed_before,
)
from src.clients.asana.handlers.projects import process_members_response
from src.clients.asana.handlers.tasks import (
    process_task_response,
    process_multiple_tasks_creation,
    process_tasks_response,
)
from src.clients.asana.responses.tasks import get_task_name_with_permalink_url
from src.config.asana import AsanaTaskConfig
from src.entities import TaskPermanentLink, AsanaTaskBasicObject
from src.render import contractor_notes_data_to_ol, wrap_in_body
from src.utils.io import csv_file_to_dataframe

be_router = APIRouter(
    prefix='/api/v1',
    tags=['backend'],
)


# todo: move another file


@be_router.post(
    path='/tasks/by_template',
    response_class=typedef.JSONResponse,
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
async def create_multiple_tasks_by_template(
    request: typedef.Request,
    asana_template_url: str,
    uploaded_file: UploadFile,
) -> typing.Sequence[TaskPermanentLink]:
    logs = request.app.logger
    logs.info('Start creating mailing tasks')

    access_token = request.cookies.get('access_token')
    task_gid = get_task_gid(asana_template_url)
    project_gid = get_project_gid(asana_template_url)
    asana_api_endpoint = request.app.asana_config.asana_api_endpoint

    async with AsyncAsanaClient(access_token, asana_api_endpoint) as client:
        members_data = await process_members_response(project_gid, client)
        task_data = await process_task_response(task_gid, client)

    task_config = AsanaTaskConfig(
        name=task_data.get('name'),
        notes=task_data.get('notes'),
        project_gid=project_gid,
    )
    dataframe = csv_file_to_dataframe(
        file=uploaded_file.file,
    )

    async with AsyncAsanaClient(access_token, asana_api_endpoint) as client:
        permanent_links_for_users = await process_multiple_tasks_creation(
            dataframe=dataframe,
            asana_client=client,
            members=members_data,
            task_config=task_config,
            logs=logs,
        )

    logs.info('Finish creating mailing tasks')
    return permanent_links_for_users


__completed_tasks_opt_fields = (  # todo: move to another file
    'name',
    'completed',
    'completed_at',
    'name',
    'created_by',
    'created_by.name',
    'created_by.email',
    'followers',
    'followers.name',
    'permalink_url',
)


@be_router.get(  # todo: is this endpoint needed?
    path='/tasks/contractor',
    response_class=typedef.JSONResponse,
)
async def get_completed_contractor_tasks(
    request: typedef.Request,
    contractor_project: str = Form(...),
    completed_since: str = Form(...),
    completed_before: str = Form(...),
) -> typing.Sequence[typing.Mapping]:
    access_token = request.cookies.get('access_token')
    project_gid = get_project_gid(contractor_project)
    asana_api_endpoint = request.app.asana_config.asana_api_endpoint

    async with AsyncAsanaClient(access_token, asana_api_endpoint) as client:
        all_tasks = await process_tasks_response(
            project_gid=project_gid,
            asana_client=client,
            completed_since=completed_since,
            opt_fields=__completed_tasks_opt_fields,
        )

    completed_tasks = filter_tasks_by_complete_status(all_tasks)
    contractor_tasks = filter_tasks_by_completed_before(completed_tasks, completed_before)

    return contractor_tasks


@be_router.post(
    path='/tasks/contractor/report',
    response_class=typedef.JSONResponse,
)
async def report_completed_contractor_tasks(
    request: typedef.Request,
    contractor_email: str | None = Form(':)'),
    contractor_project: str = Form(...),
    completed_since: str = Form(...),
    completed_before: str = Form(...),
):
    project_gid = get_project_gid(contractor_project)
    asana_api_endpoint = request.app.asana_config.asana_api_endpoint
    access_token = request.cookies.get('access_token')

    contractor_tasks = await get_completed_contractor_tasks(
        request=request,
        contractor_project=contractor_project,
        completed_since=completed_since,
        completed_before=completed_before,
    )

    async with AsyncAsanaClient(access_token, asana_api_endpoint) as client:
        agreement_project_members = await process_members_response(
            project_gid=project_gid,
            asana_client=client,
        )

        notes_data = get_task_name_with_permalink_url(contractor_tasks)
        ol_notes = contractor_notes_data_to_ol(notes_data)

        main_task = await client.tasks.create_task(  # todo: move to process
            AsanaTaskBasicObject(
                name=f'Report for {contractor_email}',
                projects=[project_gid],
                html_notes=wrap_in_body(ol_notes),
                followers=[
                    (member.get('user') or {}).get('gid')
                    for member in agreement_project_members
                ],
            )
        )

        # todo: upload pdf here

        main_task_gid = main_task.get('data').get('gid')
        subtasks = []
        for coordinator in agreement_project_members:
            coordinator = coordinator.get('user')
            subtask_response = await client.tasks.create_subtask(  # todo: move to process
                parent_task_gid=main_task_gid,
                asana_task_basic_object=AsanaTaskBasicObject(
                    assignee=coordinator.get('gid'),
                    name=f'Agreement for {coordinator.get("name")}',
                    resource_subtype='approval',
                    notes=coordinator.get('email'),
                ),
            )

        subtasks.append(subtask_response)

    return subtasks
