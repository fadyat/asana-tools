import functools
import typing

from src.errors import AsanaApiError

__all__ = (
    'catch_asana_api_error',
    'catch_token_error',
)


def catch_asana_api_error(f):
    @functools.wraps(f)
    async def inner(*args, **kwargs):
        response: typing.Mapping = await f(*args, **kwargs)
        if errors := response.get('errors'):
            message = errors[0].get('message')
            raise AsanaApiError(message)
        elif error := response.get('error'):
            raise AsanaApiError(error)

        return response.get('data')

    return inner


def catch_token_error(f):
    @functools.wraps(f)
    async def inner(*args, **kwargs):
        response: typing.Mapping = await f(*args, **kwargs)

        if errors := response.get('errors'):
            message = errors[0].get('message')
            raise AsanaApiError(message)
        elif error := response.get('error'):
            message = response.get('error_description')
            error += f'\n{message}'
            raise AsanaApiError(error)

        return response

    return inner
