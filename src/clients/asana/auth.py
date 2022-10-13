import types
import typing

import aiohttp


class AsyncAsanaAuthClient:
    def __init__(
        self,
        oauth_token_endpoint: str,
        http_session: aiohttp.ClientSession | None = None,
    ):
        self.__oauth_token_endpoint = oauth_token_endpoint
        self.__http_session = http_session or aiohttp.ClientSession()

    async def __aenter__(self):
        return self

    async def __aexit__(
        self,
        exc_type: typing.Type[BaseException] | None,
        exc_val: BaseException | None,
        exc_tb: types.TracebackType,
    ) -> None:
        await self.__http_session.close()

    async def get_access_token(
        self,
        code: str,
        client_id: str,
        client_secret: str,
        redirect_uri: str,
        grant_type: str = 'authorization_code',
    ):
        response = await self.__http_session.post(
            url=self.__oauth_token_endpoint,
            data={
                'grant_type': grant_type,
                'code': code,
                'client_id': client_id,
                'client_secret': client_secret,
                'redirect_uri': redirect_uri,
            },
        )

        return await response.json()
