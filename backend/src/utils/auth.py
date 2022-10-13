import typing
from urllib.parse import urlencode

import jwt

from src import settings


def create_auth_params(
    client_id: str = settings.ASANA_CLIENT_ID,
    redirect_uri: str = settings.ASANA_REDIRECT_URI,
    response_type: str = 'code',
) -> str:
    return urlencode(
        {
            'client_id': client_id,
            'redirect_uri': redirect_uri,
            'response_type': response_type,
        }
    )


def create_callback_params(
    code: str,
    client_id: str = settings.ASANA_CLIENT_ID,
    client_secret: str = settings.ASANA_CLIENT_SECRET,
    redirect_uri: str = settings.ASANA_REDIRECT_URI,
    grant_type: str = 'authorization_code',
) -> dict[str, str]:
    return {
        'client_id': client_id,
        'client_secret': client_secret,
        'redirect_uri': redirect_uri,
        'grant_type': grant_type,
        'code': code,
    }


def create_token(
    data: typing.Mapping,
    key: str = settings.JWT_SECRET_KEY,
    algorithm: str = settings.JWT_ALGORITHM,
) -> str:
    return jwt.encode(
        payload=data,
        key=key,
        algorithm=algorithm,
    )


def decode_token(
    token: str | None,
    key: str = settings.JWT_SECRET_KEY,
    algorithm: str = settings.JWT_ALGORITHM,
) -> typing.Mapping:
    return jwt.decode(
        jwt=token,
        key=key,
        algorithms=[algorithm],
    )
