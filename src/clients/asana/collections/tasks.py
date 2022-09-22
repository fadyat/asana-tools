import typing

from src.clients.asana.collections.base import AsyncAsanaCollection

__all__ = ('AsyncAsanaTasksCollection',)


class AsyncAsanaTasksCollection(AsyncAsanaCollection):
    async def get_task(
        self,
        task_gid: str,
        opt_fields: typing.Sequence[str] | None = None,
        opt_pretty: bool | None = None,
    ):
        params = {
            'opt_fields': opt_fields,
            'opt_pretty': opt_pretty,
        }

        return await self._client.get(
            endpoint=f'tasks/{task_gid}',
            params=params,
        )

    async def get_tasks(
        self,
        assignee: str | None = None,
        project_gid: str | None = None,
        section_gid: str | None = None,
        workspace_gid: str | None = None,
        completed_since: str | None = None,
        modified_since: str | None = None,
        limit: int | None = None,
        offset: int | None = None,
        opt_pretty: bool | None = None,
        opt_fields: typing.Sequence[str] | None = None,
    ):
        params = {
            'assignee': assignee,
            'project': project_gid,
            'section': section_gid,
            'workspace': workspace_gid,
            'completed_since': completed_since,
            'modified_since': modified_since,
            'limit': limit,
            'offset': offset,
            'opt_pretty': opt_pretty,
            'opt_fields': opt_fields,
        }

        return await self._client.get(
            endpoint='tasks',
            params=params,
        )

    async def create_task(
        self,
        name: str,
        project_gid: str,
        assignee: str | None = None,
        notes: str | None = None,
    ):
        body = {
            "data": {
                "name": name,
                "assignee": assignee,
                "projects": [project_gid],
                "notes": notes,
            }
        }

        return await self._client.post(
            endpoint='tasks',
            body=body,
        )
