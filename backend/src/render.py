import re
import typing

from src.entities import RenderingContent

__all__ = (
    'customize_template',
    'get_attributes',
    'wrap_in_body',
    'make_notes_clickable',
)


def is_link(text: str) -> bool:
    return text.startswith('http')


def customize_template(
    text: str,
    content: RenderingContent,
):
    for match in re.findall(r'{{(.*?)}}', text, re.IGNORECASE | re.DOTALL):
        value = get_attributes(content, match)

        if value is None:
            continue

        if is_link(value):
            value = f'<a href="{value}">{match}</a>'

        text = text.replace("".join(('{{', match, '}}')), value)

    return text


def get_attributes(
    content: RenderingContent,
    value: str,
):
    attribute, *attributes = value.split('.')
    if not hasattr(content, attribute):
        return None

    content = getattr(content, attribute)
    if attributes:
        return get_attributes(content, '.'.join(attributes))

    return content if content is not None else ''


def make_notes_clickable(
    notes_data: typing.Sequence[typing.Tuple[str, str]],
) -> str:
    return "".join(('<a href="%s">%s</a>\n' % (url, name) for name, url in notes_data))


def wrap_in_body(
    text: typing.Sequence[str],
) -> str:
    return f"<body>{''.join(text)}</body>"
