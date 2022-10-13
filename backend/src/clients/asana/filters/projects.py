from src.errors import AsanaInvalidParameterError

__all__ = ('get_project_gid',)


def get_project_gid(
    url: str,
) -> str:
    try:
        return list(filter(lambda x: x.isdigit(), url.split('/')))[1]
    except (ValueError, TypeError, IndexError):
        raise AsanaInvalidParameterError('Failed to parse project gid from %s' % url)
