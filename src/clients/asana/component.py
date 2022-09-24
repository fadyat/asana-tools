import json
import types
import typing

import aiohttp

from src import settings
from src.clients.asana.before_request import remove_none_values
from src.clients.asana.responses.base import catch_asana_api_error

__all__ = ('AsyncAsanaClientComponent',)


class AsyncAsanaClientComponent:
    def __init__(
        self,
        access_token: str,
        asana_api_endpoint: str = settings.ASANA_API_ENDPOINT,
        http_session: aiohttp.ClientSession | None = None,
    ):
        self.http_session = http_session or aiohttp.ClientSession()
        self.access_token = access_token
        self.api_endpoint = asana_api_endpoint

    async def __aenter__(self):
        return self

    async def __aexit__(
        self,
        exc_type: typing.Type[BaseException] | None,
        exc_val: BaseException | None,
        exc_tb: types.TracebackType,
    ) -> None:
        await self.http_session.close()

    @property
    def headers(self):
        return {"Authorization": f"Bearer {self.access_token}"}

    async def get(
        self,
        endpoint: str,
        params: typing.Mapping | None = None,
        body: typing.Mapping | None = None,
    ):
        return await self._request(
            method='get', endpoint=endpoint, params=params, body=body
        )

    async def post(
        self,
        endpoint: str,
        params: typing.Mapping | None = None,
        body: typing.Mapping | None = None,
    ):
        return await self._request(
            method='post',
            endpoint=endpoint,
            params=params,
            body=body,
        )

    async def put(
        self,
        endpoint: str,
        params: typing.Mapping | None = None,
        body: typing.Mapping | None = None,
    ):
        return await self._request(
            method='put',
            endpoint=endpoint,
            params=params,
            body=body,
        )

    async def patch(
        self,
        endpoint: str,
        params: typing.Mapping | None = None,
        body: typing.Mapping | None = None,
    ):
        return await self._request(
            method='patch',
            endpoint=endpoint,
            params=params,
            body=body,
        )

    async def delete(
        self,
        endpoint: str,
        params: typing.Mapping | None = None,
        body: typing.Mapping | None = None,
    ):
        return await self._request(
            method='delete',
            endpoint=endpoint,
            params=params,
            body=body,
        )

    @catch_asana_api_error
    async def _request(
        self,
        method: str,
        endpoint: str,
        params: typing.Mapping | None = None,
        body: typing.Mapping | None = None,
    ):
        if not isinstance(body, typing.Mapping):
            body = {}

        if not isinstance(params, typing.Mapping):
            params = {}

        params = remove_none_values(params)
        body = remove_none_values(body)

        response = await self.http_session.request(
            method=method,
            url=f"{self.api_endpoint}/{endpoint}",
            headers=self.headers,
            params=params,
            data=json.dumps(body),  # errors sometimes here
        )

        return await response.json()