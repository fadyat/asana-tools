import typing

from fastapi import APIRouter

from src import typedef
from src.clients.asana.client import AsyncAsanaClient
from src.clients.asana.filters.projects import get_project_gid
from src.clients.asana.filters.tasks import (
    filter_tasks_by_complete_status,
    filter_tasks_by_completed_before,
)
from src.clients.asana.responses.tasks import get_task_name_with_permalink_url
from src.entities import AsanaTaskBasicObject, ReportData
from src.render import wrap_in_body, make_notes_clickable

contractor_router = APIRouter()


@contractor_router.get(
    path='/contractor/tasks',
    response_class=typedef.JSONResponse,
)
async def get_completed_contractor_tasks(
    request: typedef.Request,
    contractor_project: str,
    completed_since: str,
    completed_before: str,
) -> typing.Sequence[typing.Mapping]:
    async with AsyncAsanaClient(
        asana_api_endpoint=request.app.asana_config.asana_api_endpoint,
        headers={
            'Authorization': request.cookies.get('access_token'),
            'Content-Type': 'application/json',
        },
    ) as client:
        all_tasks = await client.tasks.get_tasks(
            project=get_project_gid(contractor_project),
            completed_since=completed_since,
            opt_fields=(
                'name',
                'completed',
                'completed_at',
                'created_by',
                'created_by.name',
                'created_by.email',
                'followers',
                'followers.name',
                'permalink_url',
            ),
        )

    completed_tasks = filter_tasks_by_complete_status(all_tasks)
    contractor_tasks = filter_tasks_by_completed_before(
        completed_tasks, completed_before
    )

    return contractor_tasks


@contractor_router.post(
    path='/contractor/report',
    response_class=typedef.JSONResponse,
)
async def report_completed_contractor_tasks(
    request: typedef.Request,
    model: ReportData,
):
    logs = request.app.logger
    report_project_gid = get_project_gid(model.report_project)
    asana_api_endpoint = request.app.asana_config.asana_api_endpoint
    contractor_project_gid = get_project_gid(model.contractor_project)

    contractor_tasks = await get_completed_contractor_tasks(
        request=request,
        contractor_project=model.contractor_project,
        completed_since=model.completed_since,
        completed_before=model.completed_before,
    )

    async with AsyncAsanaClient(
        asana_api_endpoint=asana_api_endpoint,
        headers={
            'Authorization': request.cookies.get('access_token'),
            'Content-Type': 'application/json',
        },
    ) as client:
        agreement_project_members = await client.projects.get_members(
            project_gid=report_project_gid,
            opt_fields=('user.email', 'user.name'),
        )

        contractor_project = await client.projects.get_project(
            project_gid=contractor_project_gid,
        )
        asana_project_name = contractor_project.get('name')

        notes_data = get_task_name_with_permalink_url(contractor_tasks)
        completed_since = model.completed_since[:10]  # todo: rename and remove hardcode
        completed_before = model.completed_before[:10]

        task_name = (
            f'{asana_project_name} from {completed_since} to {completed_before}'
        )

        main_task = await client.tasks.create_task(
            AsanaTaskBasicObject(
                name=task_name,
                projects=[report_project_gid],
                html_notes=wrap_in_body([make_notes_clickable(notes_data)]),
                followers=[
                    (member.get('user') or {}).get('gid')
                    for member in agreement_project_members
                ],
            )
        )
        logs.info('Created main task %s', main_task.get('gid'))

        for coordinator in agreement_project_members:
            if not (user := coordinator.get('user')):
                continue

            await client.tasks.create_subtask(
                parent_task_gid=main_task.get('gid'),
                asana_task_basic_object=AsanaTaskBasicObject(
                    assignee=user.get('gid'),
                    name=user.get('name'),
                    resource_subtype='approval',
                ),
            )
            logs.info('Created subtask for %s', user.get('name'))

    return {'result': {'status': 'ok'}}
