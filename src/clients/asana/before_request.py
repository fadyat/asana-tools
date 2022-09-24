import typing

__all__ = ('remove_none_values',)


def remove_none_values(
    body: typing.Mapping,
) -> typing.Mapping:
    result = {}
    for key, value in body.items():
        if isinstance(value, typing.Mapping):
            value = remove_none_values(value)
        elif isinstance(value, typing.Sequence) and not isinstance(value, str):
            value = [v for v in value if v is not None]

        if value:
            result[key] = value

    return result
