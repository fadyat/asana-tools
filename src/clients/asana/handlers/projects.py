from src.clients.asana.client import AsyncAsanaClient
from src.clients.asana.responses.base import get_response_data
from src.errors import AsanaApiError

__all__ = ('process_members_response',)


async def process_members_response(
    project_gid: str,
    asana_client: AsyncAsanaClient,
    opt_fields: str = ('user.email', 'user.name'),
):
    members_response = await asana_client.projects.get_members(project_gid, opt_fields)

    if not (members := get_response_data(members_response)):
        raise AsanaApiError('Empty members response for project %s' % project_gid)

    return members
