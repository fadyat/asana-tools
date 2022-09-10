from typing import Sequence

import aiohttp

from src.clients.asana import AsyncAsanaClient
from src.utils import filters
from src.utils.base.log import create_logger

logger = create_logger(__name__)


def get_likes_count_from_task_response(
    task_response: dict,
) -> int:
    data = task_response.get('data') or {}
    likes = data.get('likes') or ()
    return len(likes)


async def update_tasks_likes_custom_tag_value(
    tasks_data: tuple[dict],
    asana_client: AsyncAsanaClient,
    asana_likes_field_gid: str,
):
    logger.info('Updating tasks likes')
    for task in tasks_data:
        print(asana_client.http_session.closed)
        if not (task_gid := task.get('gid')):
            continue

        try:
            response = await asana_client.get_task(task_gid)
        except (aiohttp.ContentTypeError, aiohttp.ClientError, Exception):
            logger.exception('Failed to get task %s', task_gid)
            continue

        likes_count = get_likes_count_from_task_response(response)
        logger.info('Task %s likes %s', task_gid, likes_count)
        try:
            await asana_client.update_tasks_likes_field(
                task_gid=task_gid,
                likes_field_gid=asana_likes_field_gid,
                likes_count=likes_count,
            )
        except (aiohttp.ContentTypeError, aiohttp.ClientError, Exception):
            logger.exception('Failed to update task %s', task_gid)
            continue
        else:
            logger.info('Updated task %s', task_gid)


async def get_task_data(
    template_url: str,
    asana_client: AsyncAsanaClient | None,
) -> dict:
    try:
        task_gid = filters.parse_task_gid_from_url(template_url)
        response = await asana_client.get_task(task_gid)
    except (aiohttp.ContentTypeError, aiohttp.ClientError, Exception):
        logger.exception('Failed to get task data from %s', template_url)
        return {}

    logger.info('Got task data')
    return response.get('data') or {}


def get_assignee_name(members, email):
    for member in members:
        user = member.get('user') or {}
        if user.get('email') == email:
            return user.get('name')


async def create_multiple_tasks(
    emails: Sequence[str],
    asana_client: AsyncAsanaClient,
    project_gid: str,
    notes: str,
    task_name: str,
    members: Sequence[dict],
):
    permanent_links = []
    for email in emails:
        name = get_assignee_name(members, email)
        try:
            # todo: optimize replacement
            result = await asana_client.create_task(
                name=task_name.replace('{{email}}', name).replace('{{name}}', name),
                project_gid=project_gid,
                notes=notes.replace('{{name}}', name).replace('{{email}}', email),
                assignee=email
            )
        except (aiohttp.ContentTypeError, aiohttp.ClientError, Exception):
            logger.exception('Failed to create task for %s', email)
            continue

        data = result.get('data') or {}
        logger.info('Created task %s', data.get('gid'))
        permanent_links.append(data.get('permalink_url'))

    return permanent_links
