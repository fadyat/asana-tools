import typing

from src.clients.asana.collections.base import AsyncAsanaCollection

__all__ = ('AsyncAsanaUsersCollection',)


class AsyncAsanaUsersCollection(AsyncAsanaCollection):
    async def me(self):
        return await self._client.get(
            endpoint='users/me',
        )

    async def get_users(
        self,
        workspace_gid: str | None = None,
        team_gid: str | None = None,
        opt_pretty: bool | None = None,
        opt_fields: typing.Sequence[str] | None = None,
        limit: int | None = None,
        offset: int | None = None,
    ):
        """https://developers.asana.com/docs/get-multiple-users"""

        params = {
            'workspace': workspace_gid,
            'team': team_gid,
            'opt_pretty': opt_pretty,
            'opt_fields': opt_fields,
            'limit': limit,
            'offset': offset,
        }

        return await self._client.get(
            endpoint='users',
            params=params,
        )
