from fastapi import APIRouter

from src import typedef, settings
from src.clients.asana.auth import AsyncAsanaAuthClient
from src.clients.asana.client import AsyncAsanaClient
from src.utils.auth import (
    create_callback_params,
    create_token,
    create_auth_params,
)
from src.utils.http import create_cookie

asana_auth_router = APIRouter(
    prefix='/api/v1',
    tags=['asana_auth'],
)


@asana_auth_router.post('/logout')
def asana_logout():
    response = typedef.JSONResponse(
        status_code=200,
        content={'result': {'message': 'Successfully logged out'}}
    )
    response.delete_cookie('access_token')
    response.delete_cookie('user')
    return response


@asana_auth_router.get('/auth')
def asana_auth():
    return typedef.RedirectResponse(
        url=f'{settings.ASANA_AUTH_ENDPOINT}?{create_auth_params()}',
    )


@asana_auth_router.get('/users/me')
async def asana_authorization_user(
    request: typedef.Request,
):
    if request.cookies.get('access_token') is None:
        return typedef.JSONResponse(
            status_code=401,
            content={'error': {'message': 'Unauthorized'}},
        )

    async with AsyncAsanaClient(
        asana_api_endpoint=request.app.asana_config.asana_api_endpoint,
        headers={
            'Authorization': request.cookies.get('access_token'),
            'Content-Type': 'application/json',
        },
    ) as client:
        user = await client.users.me()

    return typedef.JSONResponse(
        status_code=200,
        content={'result': {'user': user}},
    )


@asana_auth_router.get('/callback')
async def asana_authorization_callback(
    request: typedef.Request,
    code: str,
):
    async with AsyncAsanaAuthClient(
        api_endpoint=request.app.asana_config.asana_token_endpoint,
    ) as client:
        token_response = await client.get_access_token(**create_callback_params(code))

    referer = request.headers.get('Referer')
    response = typedef.RedirectResponse(url=referer)

    if referer is None:
        response = typedef.JSONResponse(
            status_code=200,
            content={'result': {'message': 'Successfully logged in'}}
        )

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

    return response
