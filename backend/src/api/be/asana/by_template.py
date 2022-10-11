import typing

from fastapi import APIRouter, Form, UploadFile, File

from src import typedef
from src.clients.asana.client import AsyncAsanaClient
from src.clients.asana.filters.projects import get_project_gid
from src.clients.asana.filters.tasks import get_task_gid
from src.clients.asana.handlers.tasks import process_multiple_tasks_creation
from src.config.asana import AsanaTaskConfig
from src.entities import TaskPermanentLink
from src.utils.io import csv_file_to_dataframe

template_router = APIRouter()


@template_router.post(
    path='/by_template',
    response_class=typedef.JSONResponse,
)
async def create_multiple_tasks_by_template(
    request: typedef.Request,
    asana_template_url: str = Form(...),
    uploaded_file: UploadFile = File(...),
) -> typing.Sequence[TaskPermanentLink]:
    logs = request.app.logger
    logs.info('Start creating mailing tasks')

    task_gid = get_task_gid(asana_template_url)
    project_gid = get_project_gid(asana_template_url)
    asana_api_endpoint = request.app.asana_config.asana_api_endpoint

    async with AsyncAsanaClient(
        asana_api_endpoint=asana_api_endpoint,
        headers={
            'Authorization': request.cookies.get('access_token'),
            'Content-Type': 'application/json',
        },
    ) as client:
        members_data = await client.projects.get_members(
            project_gid=project_gid,
            opt_fields=('user.email', 'user.name'),
        )

        task_data = await client.tasks.get_task(task_gid)

    task_config = AsanaTaskConfig(
        name=task_data.get('name'),
        notes=task_data.get('notes'),
        project_gid=project_gid,
    )

    async with AsyncAsanaClient(
        asana_api_endpoint=asana_api_endpoint,
        headers={
            'Authorization': request.cookies.get('access_token'),
            'Content-Type': 'application/json',
        },
    ) as client:
        permanent_links_for_users = await process_multiple_tasks_creation(
            dataframe=csv_file_to_dataframe(uploaded_file.file),
            asana_client=client,
            members=members_data,
            task_config=task_config,
            logs=logs,
        )

    logs.info('Finish creating mailing tasks')
    return permanent_links_for_users
