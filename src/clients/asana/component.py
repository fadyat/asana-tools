import typing

import aiohttp

from src import settings

__all__ = ('AsyncAsanaClientComponent',)

from src.clients.base import HttpClient


class AsyncAsanaClientComponent(HttpClient):
    def __init__(
        self,
        access_token: str,
        asana_api_endpoint: str = settings.ASANA_API_ENDPOINT,
        http_session: aiohttp.ClientSession | None = None,
        headers: typing.Mapping[str, str] | None = None,
    ):
        headers = headers or {}
        headers['Authorization'] = f'Bearer {access_token}'
        super().__init__(
            base_endpoint=asana_api_endpoint,
            http_session=http_session,
            headers=headers,
        )
