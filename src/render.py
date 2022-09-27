import re
import typing

from src.entities import RenderingContent

__all__ = (
    'customize_template',
    'get_attributes',
    'contractor_notes_data_to_ol',
    'wrap_in_body',
)


def customize_template(
    text: str,
    content: RenderingContent,
):
    for match in re.findall(r'{{(.*?)}}', text, re.IGNORECASE | re.DOTALL):
        value = get_attributes(content, match)

        if value is not None:
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


def contractor_notes_data_to_ol(
    notes_data: typing.Sequence[typing.Tuple[str, str]],
) -> str:
    return "".join((
        '<ol>',
        "".join((
            '<li><a href="%s">%s</a></li>' % (url, name)
            for name, url in notes_data
        )),
        '</ol>',
    ))


def wrap_in_body(
    text: str,
) -> str:
    return f'<body>{text}</body>'
