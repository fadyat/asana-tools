from fastapi import APIRouter, Form, UploadFile, File

from src import typedef
from src.clients.asana.client import AsyncAsanaClient
from src.clients.asana.filters.projects import get_project_gid
from src.clients.asana.filters.tasks import get_task_gid
from src.clients.asana.handlers.tasks import create_multiple_tasks_by_template
from src.entities import ByTemplateResponse
from src.utils.io import csv_file_to_dataframe

template_router = APIRouter()


@template_router.post(
    path='/by_template',
    response_class=typedef.JSONResponse,
    response_model=ByTemplateResponse,
)
async def create_tasks_by_template(
    request: typedef.Request,
    asana_template_url: str = Form(...),
    uploaded_file: UploadFile = File(...),
):
    if request.cookies.get('access_token') is None:
        return typedef.JSONResponse(
            status_code=401,
            content={'error': {'message': 'Unauthorized'}},
        )

    logs = request.app.logger
    task_gid = get_task_gid(asana_template_url)
    project_gid = get_project_gid(asana_template_url)

    async with AsyncAsanaClient(
        asana_api_endpoint=request.app.asana_config.asana_api_endpoint,
        headers={
            'Authorization': request.cookies.get('access_token'),
        },
    ) as client:
        members = await client.projects.get_members(
            project_gid=project_gid,
            opt_fields=('user.email', 'user.name'),
        )
        dataframe = csv_file_to_dataframe(uploaded_file.file)
        template_task = await client.tasks.get_task(
            task_gid,
            opt_fields=(
                'name', 'html_notes', 'followers', 'custom_fields',
                'projects', 'due_at', 'due_on',
            ),
        )
        response = await create_multiple_tasks_by_template(
            dataframe=dataframe,
            asana_client=client,
            members=members,
            template_task=template_task,
            logs=logs,
        )

    return response
