import typing


def create_cookie(
    cookie_name: str,
    value: str,
    max_age: int | str | None = 60 * 60 * 24 * 7,
    http_only: bool = True,
    secure: bool = True,
    same_site: str = 'none',
) -> typing.Mapping:
    return {
        "key": cookie_name,
        "value": value,
        "max_age": max_age if isinstance(max_age, int) else int(max_age),
        "httponly": http_only,
        "secure": secure,
        "samesite": same_site,
    }
