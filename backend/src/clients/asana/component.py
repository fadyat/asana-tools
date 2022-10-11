import typing

import aiohttp

from src import settings

__all__ = ('AsyncAsanaClientComponent',)

from src.clients.asana.responses.base import catch_asana_api_error

from src.clients.base import HttpClient


class AsyncAsanaClientComponent(HttpClient):
    def __init__(
        self,
        asana_api_endpoint: str = settings.ASANA_API_ENDPOINT,
        http_session: aiohttp.ClientSession | None = None,
        headers: typing.Mapping[str, str] | None = None,
    ):
        headers = headers or {}
        super().__init__(
            base_endpoint=asana_api_endpoint,
            http_session=http_session,
            headers=headers,
        )

    @catch_asana_api_error
    def _request(
        self,
        method: str,
        endpoint: str,
        params: typing.Mapping | None = None,
        body: typing.Mapping | None = None,
    ):
        return super()._request(
            method=method,
            endpoint=endpoint,
            params=params,
            body=body,
        )
