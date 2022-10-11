import typing

import pandas

from src import typedef
from src.clients.asana.client import AsyncAsanaClient
from src.clients.asana.responses.tasks import get_assignee_name
from src.entities import RenderingContent, AsanaTaskBasicObject
from src.errors import AsanaApiError
from src.render import customize_template

__all__ = ('create_multiple_tasks_by_template',)


async def create_multiple_tasks_by_template(
    dataframe: pandas.DataFrame,
    asana_client: AsyncAsanaClient,
    template_task: AsanaTaskBasicObject,
    members: typing.Sequence[typing.Mapping],
    logs: typedef.Logger,
):
    """
    Create multiple tasks by template.
    :param dataframe: Dataframe with data for rendering.
    :param asana_client: Asana client.
    :param template_task: Template task.
    :param members: List of members.
    :param logs: Logger.
    :return: List of permanent links for created tasks.
    """

    for _, row in dataframe.iterrows():
        rendering_content = RenderingContent(
            name=get_assignee_name(members, row.email),
            email=row.email,
        ).set_dynamic_fields(row.to_dict())

        try:
            await asana_client.tasks.create_task(
                AsanaTaskBasicObject(
                    name=customize_template(template_task.name, rendering_content),
                    projects=template_task.projects,
                    notes=customize_template(template_task.notes, rendering_content),
                    assignee=row.email,
                )
            )
        except AsanaApiError as e:
            logs.error(f'Error while creating task for {row.email}: {e}')
            continue

        logs.info('Task created for %s' % row.email)
