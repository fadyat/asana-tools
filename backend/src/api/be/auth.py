import jwt
from fastapi import APIRouter

from src import typedef
from src.clients.asana.auth import AsyncAsanaAuthClient
from src.utils.auth import (
    create_auth_params,
    create_callback_params,
    create_token,
    decode_token,
)
from src.utils.http import create_cookie

asana_auth_router = APIRouter(
    prefix='/api/v1',
    tags=['asana_auth'],
)


@asana_auth_router.get('/auth')
async def asana_authorization(
    request: typedef.Request,
):
    return typedef.RedirectResponse(
        url=f'{request.app.asana_config.asana_auth_endpoint}?{create_auth_params()}',
    )


@asana_auth_router.get('/logout')
async def asana_logout(
    response: typedef.Response,
):
    response.delete_cookie('access_token')
    response.delete_cookie('user')
    return {'result': {'message': 'Successfully logged out'}}


@asana_auth_router.get('/auth/user')
async def asana_authorization_user(
    request: typedef.Request,
):
    try:
        decoded = decode_token(request.cookies.get('user'))
    except (
        jwt.exceptions.InvalidSignatureError,
        jwt.exceptions.ExpiredSignatureError,
        jwt.exceptions.PyJWTError,
    ):
        return typedef.Response('Unauthorized', 401)

    return decoded


@asana_auth_router.get('/callback')
async def asana_authorization_callback(
    request: typedef.Request,
    response: typedef.Response,
    code: str,
):
    async with AsyncAsanaAuthClient(
        api_endpoint=request.app.asana_config.asana_token_endpoint,
    ) as client:
        token_response = await client.get_access_token(**create_callback_params(code))

    # setting access token cookie for making requests to asana api
    response.set_cookie(
        **create_cookie(
            cookie_name='access_token',
            value=f'Bearer {token_response.get("access_token")}',
            max_age=token_response.get('expires_in'),
        )
    )

    # setting refresh token http only cookie
    response.set_cookie(
        **create_cookie(
            cookie_name='refresh_token',
            value=token_response.get('refresh_token'),
        )
    )

    # setting user cookie for frontend
    response.set_cookie(
        **create_cookie(
            cookie_name='user',
            value=create_token(token_response.get('data')),
            http_only=False,
            max_age=token_response.get('expires_in'),
        )
    )

    # if it was called from frontend redirect back
    if refer := request.headers.get('Referer'):
        return typedef.RedirectResponse(
            url=refer,
            headers=response.headers,
        )

    return token_response
