import typing

from src.clients.asana.collections.base import AsyncAsanaCollection

__all__ = ('AsyncAsanaProjectsCollection',)


class AsyncAsanaProjectsCollection(AsyncAsanaCollection):
    async def get_project(
        self,
        project_gid: str,
    ):
        return await self._client.get(
            endpoint=f'projects/{project_gid}',
        )

    async def get_members(
        self,
        project_gid: str,
        opt_fields: typing.Sequence[str] | None = None,
    ):
        params = {"data": {"opt_fields": opt_fields}}

        return await self._client.get(
            endpoint=f'projects/{project_gid}/project_memberships',
            params=params,
        )
