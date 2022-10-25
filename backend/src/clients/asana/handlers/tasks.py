import typing

import pandas

from src import typedef
from src.clients.asana.client import AsyncAsanaClient
from src.clients.asana.responses.tasks import get_assignee_name
from src.entities import RenderingContent, AsanaTaskRequest, AsanaTaskResponse, ByTemplateResponse
from src.errors import AsanaApiError
from src.render import customize_template

__all__ = ('create_multiple_tasks_by_template',)


async def create_multiple_tasks_by_template(
    dataframe: pandas.DataFrame,
    asana_client: AsyncAsanaClient,
    template_task: AsanaTaskResponse,
    members: typing.Sequence[typing.Mapping],
    logs: typedef.Logger,
) -> ByTemplateResponse:
    response = ByTemplateResponse()
    for _, row in dataframe.iterrows():
        rendering_content = RenderingContent(
            name=get_assignee_name(members, row.email),
            email=row.email,
        ).set_dynamic_fields(row.to_dict())

        if not rendering_content.name:
            rendering_content.name = row.email

        new_task = AsanaTaskRequest().from_response(
            template_task,
            name=customize_template(template_task.name, rendering_content),
            notes=customize_template(template_task.notes, rendering_content),
            assignee=rendering_content.email,
        )

        try:
            task = await asana_client.tasks.create_task(new_task)
        except AsanaApiError as e:
            logs.error(f'Error while creating task for {row.email}: {e}')
            response.add_failed_task(new_task, e)
            continue
        else:
            response.add_created_task(task)
            logs.info('Task created for %s' % row.email)

    return response
