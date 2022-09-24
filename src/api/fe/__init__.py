from fastapi import APIRouter
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates

from src import typedef

templates_render = Jinja2Templates(
    directory='templates',
)

fe_router = APIRouter(
    tags=['frontend'],
)


# todo: move another file


@fe_router.get(
    path='/tasks/by_template',
    response_class=HTMLResponse,
)
async def create_multiple_tasks_form(
    request: typedef.Request,
):
    be_api_endpoint = '/api/v1/tasks/by_template'
    return templates_render.TemplateResponse(
        name='tasks_by_template.html',
        context={'request': request, 'api_endpoint': be_api_endpoint},
    )


@fe_router.get(
    path='/tasks/contractor',
    response_class=HTMLResponse,
)
async def get_contractor_tasks_form(
    request: typedef.Request,
):
    be_api_endpoint = '/api/v1/tasks/contractor/report'
    return templates_render.TemplateResponse(
        name='tasks_contractor.html',
        context={'request': request, 'api_endpoint': be_api_endpoint},
    )
