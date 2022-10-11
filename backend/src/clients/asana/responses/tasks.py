import typing

__all__ = ('get_assignee_name', 'get_task_name_with_permalink_url')


def get_assignee_name(members, email) -> str | None:
    for member in members:
        user = member.get('user') or {}
        if user.get('email') == email:
            return user.get('name')

    return None


def get_task_name_with_permalink_url(
    tasks: typing.Sequence[typing.Mapping],
):
    return [(task.get('name'), task.get('permalink_url')) for task in tasks]
