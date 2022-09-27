from src.clients.asana.collections.base import AsyncAsanaCollection

__all__ = ('AsyncAsanaUsersCollection',)


class AsyncAsanaUsersCollection(AsyncAsanaCollection):
    async def me(self):
        return await self._client.get(
            endpoint='users/me',
        )
