from datetime import datetime

from fastapi import APIRouter, Form, UploadFile, File
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates

from src import typedef
from src.api.be import create_multiple_tasks_by_template
from src.api.be.auth import asana_authorization

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
def create_multiple_tasks_form(
    request: typedef.Request,
):
    return templates_render.TemplateResponse(
        name='tasks_by_template.html',
        context={'request': request, 'api_endpoint': '/tasks/by_template'},
    )


@fe_router.post(
    path='/tasks/by_template',
    response_class=HTMLResponse,
)
async def rendered_multiple_tasks_response(
    request: typedef.Request,
    asana_template_url: str = Form(...),
    uploaded_file: UploadFile = File(...),
):
    permanent_links = await create_multiple_tasks_by_template(  # todo: do actual api call
        request=request,
        asana_template_url=asana_template_url,
        uploaded_file=uploaded_file,
    )

    return templates_render.TemplateResponse(
        name='tasks_by_template_response.html',
        context={'request': request, 'permanent_links': permanent_links},
    )


@fe_router.get(
    path='/tasks/contractor',
    response_class=HTMLResponse,
)
def get_contractor_tasks_form(
    request: typedef.Request,
):
    be_api_endpoint = '/api/v1/tasks/contractor/report'
    current_date = datetime.utcnow()
    prev_month_date = current_date.replace(month=current_date.month - 1)

    return templates_render.TemplateResponse(
        name='tasks_contractor.html',
        context={
            'request': request,
            'api_endpoint': be_api_endpoint,
            'prev_month': prev_month_date.strftime('%Y-%m-%d'),
        },
    )


@fe_router.get(
    path='/auth',
    response_class=HTMLResponse,
)
def authorization(
    request: typedef.Request,
):
    return templates_render.TemplateResponse(
        name='authorization.html',
        context={'request': request},
    )


@fe_router.get(
    path='/actual_auth',
    response_class=HTMLResponse,
)
async def actual_authorization(
    request: typedef.Request,
):
    return await asana_authorization(
        request=request,
    )
