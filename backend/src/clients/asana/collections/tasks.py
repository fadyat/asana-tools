import typing

from src.clients.asana.collections.base import AsyncAsanaCollection
from src.entities import AsanaTaskRequest, AsanaTaskResponse

__all__ = ('AsyncAsanaTasksCollection',)


class AsyncAsanaTasksCollection(AsyncAsanaCollection):
    async def get_task(
        self,
        task_gid: str,
        opt_fields: typing.Sequence[str] | None = None,
        opt_pretty: bool | None = None,
    ) -> AsanaTaskResponse:
        """https://developers.asana.com/docs/get-a-task"""

        params = {
            'opt_fields': opt_fields,
            'opt_pretty': opt_pretty,
        }

        response = await self._client.get(
            endpoint=f'tasks/{task_gid}',
            params=params,
        )
        return AsanaTaskResponse(**response)

    async def get_tasks(
        self,
        assignee: str | None = None,
        project: str | None = None,
        section: str | None = None,
        workspace: str | None = None,
        completed_since: str | None = None,
        modified_since: str | None = None,
        limit: int | None = None,
        offset: int | None = None,
        opt_pretty: bool | None = None,
        opt_fields: typing.Sequence[str] | None = None,
    ) -> typing.Sequence[AsanaTaskResponse]:
        """https://developers.asana.com/docs/get-multiple-tasks"""

        params = {
            'assignee': assignee,
            'project': project,
            'section': section,
            'workspace': workspace,
            'completed_since': completed_since,
            'modified_since': modified_since,
            'limit': limit,
            'offset': offset,
            'opt_pretty': opt_pretty,
            'opt_fields': opt_fields,
        }

        response = await self._client.get(
            endpoint='tasks',
            params=params,
        )

        return [AsanaTaskResponse(**task) for task in response]

    async def create_task(
        self,
        asana_task_basic_object: AsanaTaskRequest,
    ) -> AsanaTaskResponse:
        """https://developers.asana.com/docs/create-a-task"""

        body = {"data": asana_task_basic_object.dict()}

        response = await self._client.post(
            endpoint='tasks',
            body=body,
        )

        return AsanaTaskResponse(**response)

    async def create_subtask(
        self,
        parent_task_gid: str,
        asana_task_basic_object: AsanaTaskRequest,
    ) -> AsanaTaskResponse:
        """https://developers.asana.com/docs/create-a-subtask"""

        body = {"data": asana_task_basic_object.dict()}

        response = await self._client.post(
            endpoint=f'tasks/{parent_task_gid}/subtasks',
            body=body,
        )
        return AsanaTaskResponse(**response)

    async def update_task(
        self,
        task_gid: str,
        asana_task_basic_object: AsanaTaskRequest,
    ):
        """https://developers.asana.com/docs/update-a-task"""

        body = {"data": asana_task_basic_object.dict()}

        return await self._client.put(
            endpoint=f'tasks/{task_gid}',
            body=body,
        )
