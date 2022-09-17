import typing

import pandas

from src.clients.asana.client import AsyncAsanaClient
from src.clients.asana.responses.base import get_response_data
from src.clients.asana.responses.tasks import get_assignee_name
from src.entities import AsanaTaskConfig, RenderingContent
from src.errors import AsanaApiError
from src.render import customize_template

__all__ = (
    'process_task_response',
    'process_multiple_tasks_creation',
)

from src.utils import log


async def process_task_response(
    task_gid: str,
    asana_client: AsyncAsanaClient,
) -> typing.Mapping:
    tasks_response = await asana_client.tasks.get_task(task_gid)

    if not (task := get_response_data(tasks_response)):
        raise AsanaApiError('Empty response for task %s' % task_gid)

    return task


async def process_multiple_tasks_creation(
    dataframe: pandas.DataFrame,
    asana_client: AsyncAsanaClient,
    task_config: AsanaTaskConfig,
    members: typing.Sequence[typing.Mapping],
):
    logs = log.logger
    permanent_links_for_users = []
    for _, row in dataframe.iterrows():
        rendering_content = RenderingContent(
            name=get_assignee_name(members, row.email),
            email=row.email,
        ).set_dynamic_fields(row.to_dict())

        try:
            result = await asana_client.tasks.create_task(
                name=customize_template(task_config.name, rendering_content),
                project_gid=task_config.project_gid,
                notes=customize_template(task_config.notes, rendering_content),
                assignee=row.email,
            )
        except AsanaApiError:
            logs.exception('Failed to create task for %s' % row.email)
            continue

        permanent_links_for_users.append(
            (rendering_content.name, get_response_data(result).get('permalink_url'))
        )

    return permanent_links_for_users
