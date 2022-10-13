from fastapi import APIRouter, Form, UploadFile, File

from src import typedef
from src.clients.asana.client import AsyncAsanaClient
from src.clients.asana.filters.projects import get_project_gid
from src.clients.asana.filters.tasks import get_task_gid
from src.clients.asana.handlers.tasks import create_multiple_tasks_by_template
from src.entities import AsanaTaskBasicObject
from src.utils.io import csv_file_to_dataframe

template_router = APIRouter()


@template_router.post(
    path='/by_template',
    response_class=typedef.JSONResponse,
)
async def create_tasks_by_template(
    request: typedef.Request,
    asana_template_url: str = Form(...),
    uploaded_file: UploadFile = File(...),
):
    logs = request.app.logger
    task_gid = get_task_gid(asana_template_url)
    project_gid = get_project_gid(asana_template_url)

    async with AsyncAsanaClient(
        asana_api_endpoint=request.app.asana_config.asana_api_endpoint,
        headers={
            'Authorization': request.cookies.get('access_token'),
            'Content-Type': 'application/json',
        },
    ) as client:
        members = await client.projects.get_members(
            project_gid=project_gid,
            opt_fields=('user.email', 'user.name'),
        )

        task = await client.tasks.get_task(
            task_gid=task_gid,
        )

        await create_multiple_tasks_by_template(
            dataframe=csv_file_to_dataframe(uploaded_file.file),
            asana_client=client,
            members=members,
            template_task=AsanaTaskBasicObject(
                name=task.get('name'),
                notes=task.get('notes'),
                projects=[project_gid],
            ),
            logs=logs,
        )

    return {'result': {'status': 'ok'}}
