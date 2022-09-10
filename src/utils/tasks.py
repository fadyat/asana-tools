import aiohttp

from src.clients.asana import AsyncAsanaClient
from src.utils.base import create_logger
from src.utils.io import get_task_notes_from_file

logger = create_logger(__name__)


def get_likes_count_from_task_response(
    task_response: dict,
) -> int:
    data = task_response.get('data') or {}
    likes = data.get('likes') or ()
    return len(likes)


def parse_task_gid_from_url(
    url: str | None,
) -> str:
    return list(filter(lambda x: x.isdigit(), url.split('/')))[-1]


async def get_task_notes_from_task(
    asana_client: AsyncAsanaClient,
    task_gid: str,
) -> object:
    try:
        response = await asana_client.get_task(task_gid)
    except (aiohttp.ContentTypeError, aiohttp.ClientError, Exception):
        logger.exception('Failed to get task %s', task_gid)
        return None

    return (response.get('data') or {}).get('notes')


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


async def get_notes(
    template_file: str | None,
    template_url: str | None,
    asana_client: AsyncAsanaClient | None,
) -> str | None:
    if notes := get_task_notes_from_file(template_file):
        logger.info('Notes from file')
        return notes

    if not template_url or not (task_gid := parse_task_gid_from_url(template_url)):
        logger.error('Failed to parse task gid from url')
        return None

    if notes := await get_task_notes_from_task(asana_client, task_gid):
        logger.info('Notes from task')
        return notes

    return None
