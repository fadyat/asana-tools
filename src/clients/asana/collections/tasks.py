from src.clients.asana.collections.base import AsyncAsanaCollection

__all__ = ('AsyncAsanaTasksCollection',)


class AsyncAsanaTasksCollection(AsyncAsanaCollection):
    async def get_task(
        self,
        task_gid: str,
    ):
        return await self._client.get(endpoint=f'tasks/{task_gid}')

    async def get_tasks(
        self,
        project_gid: str,
        assignee: str | None = None,
    ):
        params = {'project': project_gid, 'assignee': assignee}

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
