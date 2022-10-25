import typing

from src.clients.asana.collections.base import AsyncAsanaCollection

__all__ = ('AsyncAsanaProjectsCollection',)


class AsyncAsanaProjectsCollection(AsyncAsanaCollection):
    async def get_project(
        self,
        project_gid: str,
        opt_fields: typing.Sequence[str] | None = None,
        opt_pretty: bool | None = None,
    ):
        """https://developers.asana.com/docs/get-a-project"""

        return await self._client.get(
            endpoint=f'projects/{project_gid}',
            params={
                'opt_fields': opt_fields,
                'opt_pretty': opt_pretty,
            },
        )

    async def get_members(
        self,
        project_gid: str,
        opt_fields: typing.Sequence[str] | None = None,
    ):
        params = {"opt_fields": opt_fields}

        return await self._client.get(
            endpoint=f'projects/{project_gid}/project_memberships',
            params=params,
        )
