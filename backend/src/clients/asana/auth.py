import typing

import aiohttp

from src.clients.asana.responses.base import catch_token_error
from src.clients.base import HttpClient


class AsyncAsanaAuthClient(HttpClient):
    def __init__(
        self,
        api_endpoint: str,
        http_session: aiohttp.ClientSession | None = None,
        headers: typing.Mapping[str, str] | None = None,
    ):
        super().__init__(api_endpoint, http_session, headers)

    @catch_token_error
    async def get_access_token(
        self,
        code: str,
        client_id: str,
        client_secret: str,
        redirect_uri: str,
        grant_type: str = 'authorization_code',
    ):
        return await self.post(
            endpoint='',
            body={
                'grant_type': grant_type,
                'code': code,
                'client_id': client_id,
                'client_secret': client_secret,
                'redirect_uri': redirect_uri,
            },
        )
