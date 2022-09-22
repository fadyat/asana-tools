__all__ = ('remove_none_values',)

import typing


def remove_none_values(
    body: typing.Mapping,
) -> typing.Mapping:
    data = body.get('data') or body
    return {key: value for key, value in data.items() if value}
