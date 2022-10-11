import typing

from src.errors import AsanaInvalidParameterError

__all__ = (
    'get_task_gid',
    'filter_tasks_by_complete_status',
    'filter_tasks_by_completed_before',
)


def get_task_gid(
    url: str,
) -> str:
    try:
        return list(filter(lambda x: x.isdigit(), url.split('/')))[-1]
    except (ValueError, TypeError, IndexError):
        raise AsanaInvalidParameterError('Failed to parse task gid from %s' % url)


def filter_tasks_by_complete_status(
    tasks: typing.Sequence[typing.Mapping],
) -> typing.Sequence[typing.Mapping]:
    return [task for task in tasks if task.get('completed')]


def filter_tasks_by_creator(
    tasks: typing.Sequence[typing.Mapping],
    creator_email: str | None = None,
    creator_name: str | None = None,
) -> typing.Sequence[typing.Mapping]:
    creator_tasks = []
    for task in tasks:
        if not (created_by := task.get('created_by')):
            continue

        if creator_email and creator_email == created_by.get('email'):
            creator_tasks.append(task)
        elif creator_name and creator_name == created_by.get('name'):
            creator_tasks.append(task)

    return creator_tasks


def filter_tasks_by_completed_before(
    tasks: typing.Sequence[typing.Mapping],
    completed_before: str,
) -> typing.Sequence[typing.Mapping]:
    return [task for task in tasks if task.get('completed_at') < completed_before]
