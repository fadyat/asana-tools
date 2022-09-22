from src.errors import AsanaInvalidParameterError

__all__ = ('get_task_gid',)


def get_task_gid(
    url: str,
) -> str:
    try:
        return list(filter(lambda x: x.isdigit(), url.split('/')))[-1]
    except (ValueError, TypeError, IndexError):
        raise AsanaInvalidParameterError('Failed to parse task gid from %s' % url)
