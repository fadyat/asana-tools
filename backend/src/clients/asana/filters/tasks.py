import typing

from src.entities import AsanaTaskResponse
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
    tasks: typing.Sequence[AsanaTaskResponse],
) -> typing.Sequence[AsanaTaskResponse]:
    return [task for task in tasks if task.completed]


def filter_tasks_by_completed_before(
    tasks: typing.Sequence[AsanaTaskResponse],
    completed_before: str,
) -> typing.Sequence[AsanaTaskResponse]:
    return [
        task
        for task in tasks
        if task.completed_at < completed_before
    ]
