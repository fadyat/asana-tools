import functools
import typing

from src.errors import AsanaApiError

__all__ = (
    'get_response_data',
    'catch_asana_api_error',
)


def catch_asana_api_error(f):
    @functools.wraps(f)
    async def inner(*args, **kwargs):
        response: typing.Mapping = await f(*args, **kwargs)
        if errors := response.get('errors'):
            message = errors[0].get('message')
            raise AsanaApiError(message)
        return response

    return inner


def get_response_data(
    response: typing.Mapping,
):
    return response.get('data') or {}
