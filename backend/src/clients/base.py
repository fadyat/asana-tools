import json
import types
import typing

import aiohttp

from src.clients.asana.before_request import remove_none_values


class HttpClient:
    def __init__(
        self,
        base_endpoint: str,
        http_session: aiohttp.ClientSession | None = None,
        headers: typing.Mapping[str, str] | None = None,
    ):
        self.http_session = http_session or aiohttp.ClientSession()
        self.api_endpoint = base_endpoint
        self.headers = headers or {}

    async def __aenter__(self):
        return self

    async def __aexit__(
        self,
        exc_type: typing.Type[BaseException] | None,
        exc_val: BaseException | None,
        exc_tb: types.TracebackType,
    ) -> None:
        await self.http_session.close()

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

        if self.headers.get('Content-Type') == 'application/json':
            body = json.dumps(body)

        response = await self.http_session.request(
            method=method,
            url=f"{self.api_endpoint}/{endpoint}",
            headers=self.headers,
            params=params,
            data=body,
            ssl=False,
        )

        # todo: specify response code for handling errors

        return await response.json()
