import aiohttp
import fire

from src import settings
from src.clients.asana import AsyncAsanaClient
from src.utils.base import create_logger
from src.utils.projects import get_custom_fields
from src.utils.tasks import (
    update_tasks_likes_custom_tag_value,
    get_notes
)

logger = create_logger(__name__)


async def project_custom_fields(
    project_id: str = settings.ASANA_PROJECT_ID,
):
    """
    Method for getting custom field id for likes
    :param project_id:
    :return:
    """
    asana_client = AsyncAsanaClient(
        access_token=settings.ASANA_API_KEY,
        asana_api_endpoint=settings.ASANA_API_ENDPOINT,
    )
    logger.info('Started')
    async with asana_client as client:
        logger.info('Getting custom fields')
        try:
            result = await client.get_project(
                project_gid=project_id,
            )
        except (aiohttp.ContentTypeError, aiohttp.ClientError, Exception):
            logger.exception('Failed to get project')
            return

    logger.info('Done!')
    return get_custom_fields(result)


async def count_likes():
    logger = create_logger(__name__)
    asana_client = AsyncAsanaClient(
        access_token=settings.ASANA_API_KEY,
        asana_api_endpoint=settings.ASANA_API_ENDPOINT,
    )
    logger.info('Started')
    async with asana_client as client:
        logger.info('Getting tasks')
        try:
            result = await client.get_tasks(
                project_gid=settings.ASANA_PROJECT_ID,
            )
        except (aiohttp.ContentTypeError, aiohttp.ClientError, Exception):
            logger.exception('Failed to get tasks')
            return

        await update_tasks_likes_custom_tag_value(
            tasks_data=result.get('data') or (),
            asana_client=client,
            asana_likes_field_gid=settings.ASANA_LIKES_FIELD_ID,
        )

    logger.info('Done!')


async def create_task(
    template_url: str | None = None,
    template_file: str | None = None,
):
    logger.info('Started')
    asana_client = AsyncAsanaClient(
        access_token=settings.ASANA_API_KEY,
        asana_api_endpoint=settings.ASANA_API_ENDPOINT,
    )

    async with asana_client as client:
        notes = await get_notes(template_file, template_url, client)
        result = await client.create_task(
            name='Test task',
            project_gid=settings.ASANA_PROJECT_ID,
            notes=notes
        )

    return (result.get('data') or {}).get('permalink_url')


if __name__ == '__main__':
    fire.Fire({'likes': count_likes, 'tasks': create_task})
