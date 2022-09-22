import typing

from fastapi import APIRouter, Form, File, UploadFile
from fastapi.responses import JSONResponse

from src import typedef
from src.clients.asana.client import AsyncAsanaClient
from src.clients.asana.filters.projects import get_project_gid
from src.clients.asana.filters.tasks import get_task_gid
from src.clients.asana.handlers.projects import process_members_response
from src.clients.asana.handlers.tasks import process_task_response, process_multiple_tasks_creation
from src.config.asana import AsanaTaskConfig
from src.entities import TaskPermanentLink
from src.utils.io import csv_file_to_dataframe

be_router = APIRouter(
    prefix='/api/v1',
    tags=['backend'],
)


# todo: move another file


@be_router.post(
    path='/tasks',
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
        )

    logs.info('Finish creating mailing tasks')
    return permanent_links_for_users
