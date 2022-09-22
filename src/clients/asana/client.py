import aiohttp

from src import settings
from src.clients.asana.collections.projects import AsyncAsanaProjectsCollection
from src.clients.asana.collections.tasks import AsyncAsanaTasksCollection
from src.clients.asana.component import AsyncAsanaClientComponent

__all__ = ('AsyncAsanaClient',)


class AsyncAsanaClient:
    def __init__(
        self,
        access_token: str,
        asana_api_endpoint: str = settings.ASANA_API_ENDPOINT,
        http_session: aiohttp.ClientSession | None = None,
    ):
        self.__client = AsyncAsanaClientComponent(
            access_token, asana_api_endpoint, http_session
        )
        self.tasks = AsyncAsanaTasksCollection(self.__client)
        self.projects = AsyncAsanaProjectsCollection(self.__client)

    async def __aenter__(self):
        await self.__client.__aenter__()
        return self

    async def __aexit__(self, exc_type, exc, tb):
        await self.__client.__aexit__(exc_type, exc, tb)
