import re

from src.entities import RenderingContent


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
