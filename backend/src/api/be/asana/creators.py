from collections import defaultdict

from fastapi import APIRouter, encoders

from src import typedef
from src.clients.asana.client import AsyncAsanaClient
from src.clients.asana.filters.projects import get_project_gid
from src.clients.asana.filters.tasks import (
    get_incomplete_tasks, filter_tasks_by_complete_status,
    filter_tasks_by_completed_before, filter_tasks_by_modified_at
)
from src.entities import CreatorsModel, ActivityResponse, ActivityItem
from src.errors import AsanaInvalidParameterError

creators_router = APIRouter()


@creators_router.post(
    path='/activity',
    response_class=typedef.JSONResponse,
    description='get all users who followed a task in a given time period',
)
async def get_activity(
    request: typedef.Request,
    model: CreatorsModel,
):
    if request.cookies.get('access_token') is None:
        return typedef.JSONResponse(
            status_code=401,
            content={'error': {'message': 'Unauthorized'}},
        )

    try:
        project_gid = get_project_gid(model.project)
    except AsanaInvalidParameterError as e:
        return typedef.JSONResponse(
            status_code=400,
            content={'error': {'message': str(e)}},
        )

    async with AsyncAsanaClient(
        asana_api_endpoint=request.app.asana_config.asana_api_endpoint,
        headers={
            'Authorization': request.cookies.get('access_token'),
            'Content-Type': 'application/json',
        },
    ) as client:
        all_tasks = await client.tasks.get_tasks(
            project=project_gid,
            completed_since=model.completed_since,
            opt_fields=(
                'created_at', 'permalink_url', 'completed_at',
                'modified_at', 'followers', 'followers.name',
                'followers.email',
            ),
        )

    modified_since, modified_before = model.completed_since, model.completed_before
    incomplete_tasks = get_incomplete_tasks(all_tasks)
    active_tasks = filter_tasks_by_modified_at(incomplete_tasks, modified_since)
    completed_tasks = filter_tasks_by_completed_before(
        filter_tasks_by_complete_status(all_tasks),
        model.completed_before,
    )

    log = request.app.logger
    log.info(f'active tasks: {len(active_tasks)}, completed tasks: {len(completed_tasks)}')

    user_counts = defaultdict(int)
    for task in *active_tasks, *completed_tasks:
        for follower in task.followers:
            if email := follower.get('email'):
                user_counts[email] += 1

    sorted_users = sorted(user_counts.items(), key=lambda x: x[1], reverse=True)
    activity_response = ActivityResponse(
        length=len(sorted_users),
        result=[
            ActivityItem(
                user_email=user_email,
                actions_cnt=count,
            )
            for user_email, count in sorted_users
        ]
    )

    return typedef.JSONResponse(
        status_code=200,
        content=encoders.jsonable_encoder(activity_response),
    )
