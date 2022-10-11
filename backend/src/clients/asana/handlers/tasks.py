import typing

import pandas

from src import typedef
from src.clients.asana.client import AsyncAsanaClient
from src.clients.asana.responses.tasks import get_assignee_name
from src.config.asana import AsanaTaskConfig
from src.entities import RenderingContent, TaskPermanentLink, AsanaTaskBasicObject
from src.errors import AsanaApiError
from src.render import customize_template

__all__ = ('process_multiple_tasks_creation',)


async def process_multiple_tasks_creation(
    dataframe: pandas.DataFrame,
    asana_client: AsyncAsanaClient,
    task_config: AsanaTaskConfig,
    members: typing.Sequence[typing.Mapping],
    logs: typedef.Logger,
) -> typing.Sequence[TaskPermanentLink]:
    permanent_links_for_users = []
    for _, row in dataframe.iterrows():
        rendering_content = RenderingContent(
            name=get_assignee_name(members, row.email),
            email=row.email,
        ).set_dynamic_fields(row.to_dict())

        try:
            # todo: remove taskConfig and replace to asanaTaskBasicObject
            task = await asana_client.tasks.create_task(
                AsanaTaskBasicObject(
                    name=customize_template(task_config.name, rendering_content),
                    projects=[
                        task_config.project_gid,
                    ],
                    notes=customize_template(task_config.notes, rendering_content),
                    assignee=row.email,
                )
            )
        except AsanaApiError:
            logs.exception('Failed to create task for %s' % row.email)
            continue

        logs.info('Task created for %s' % row.email)

        permanent_links_for_users.append(
            TaskPermanentLink(rendering_content.name, task.get('permalink_url'))
        )

    return permanent_links_for_users
