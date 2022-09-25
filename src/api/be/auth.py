import typing
from urllib.parse import urlencode

from fastapi import APIRouter

from src import typedef, settings
from src.clients.asana.auth import AsyncAsanaAuthClient

asana_auth_router = APIRouter(
    prefix='/api/v1',
    tags=['asana_auth'],
)

# todo: move to another file
__auth_params = {
    'client_id': settings.ASANA_CLIENT_ID,
    'redirect_uri': settings.ASANA_REDIRECT_URI,
    'response_type': 'code',
}

# todo: move to another file
__callback_params = {
    'client_id': settings.ASANA_CLIENT_ID,
    'client_secret': settings.ASANA_CLIENT_SECRET,
    'redirect_uri': settings.ASANA_REDIRECT_URI,
    'grant_type': 'authorization_code',
}


@asana_auth_router.get('/auth')
async def asana_authorization(
    request: typedef.Request,
):
    configured_auth_url = (
        f'{request.app.asana_config.asana_auth_endpoint}?{urlencode(__auth_params)}'
    )
    return typedef.RedirectResponse(
        url=configured_auth_url,
    )


# todo: move to another file
def create_cookie(
    cookie_name: str,
    value: str,
    max_age: int | str | None = 60 * 60 * 24 * 7,
    http_only: bool = True,
    secure: bool = True,
    same_site: str = "Strict",
) -> typing.Mapping:
    return {
        "key": cookie_name,
        "value": value,
        "max_age": max_age if isinstance(max_age, int) else int(max_age),
        "httponly": http_only,
        "secure": secure,
        "samesite": same_site,
    }


@asana_auth_router.get('/callback')
async def asana_authorization_callback(
    request: typedef.Request,
    response: typedef.Response,
    code: str,
):
    async with AsyncAsanaAuthClient(
        oauth_token_endpoint=request.app.asana_config.asana_api_token_endpoint,
    ) as client:
        token_response = await client.get_access_token(**__callback_params, code=code)

    response.set_cookie(
        **create_cookie(
            cookie_name='access_token',
            value=token_response['access_token'],
            max_age=token_response['expires_in'],
        )
    )

    response.set_cookie(
        **create_cookie(
            cookie_name='refresh_token',
            value=token_response['refresh_token'],
        )
    )

    return token_response


@asana_auth_router.get('/access_token')
async def asana_get_access_token(
    request: typedef.Request,
):
    return typedef.JSONResponse(
        content={'access_token': request.cookies.get('access_token')},
    )
