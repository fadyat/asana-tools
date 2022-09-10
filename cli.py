import aiohttp
import fire

from src import settings
from src.clients.asana import AsyncAsanaClient
from src.utils.asana.projects import get_custom_fields
from src.utils.asana.tasks import (
    update_tasks_likes_custom_tag_value,
    create_multiple_tasks, get_task_data
)
from src.utils.base.log import create_logger
from src.utils.io import csv_file_to_dataframe, get_email_column_values

logger = create_logger(__name__)


async def project_custom_fields(
    project_id: str = settings.ASANA_PROJECT_ID,
):
    logger.info('Started')

    async with AsyncAsanaClient(
        access_token=settings.ASANA_API_KEY,
        asana_api_endpoint=settings.ASANA_API_ENDPOINT,
    ) as client:
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
    logger.info('Started')

    async with AsyncAsanaClient(
        access_token=settings.ASANA_API_KEY,
        asana_api_endpoint=settings.ASANA_API_ENDPOINT,
    ) as client:
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


async def create_mailing_tasks(
    data_file: str = settings.DATA_CSV_FILE_NAME,
    template_url: str = settings.ASANA_TASK_TEMPLATE_URL,
):
    logger.info('Started')

    async with AsyncAsanaClient(
        access_token=settings.ASANA_API_KEY,
        asana_api_endpoint=settings.ASANA_API_ENDPOINT,
    ) as client:
        members = (await client.get_project_memberships(
            project_gid=settings.ASANA_PROJECT_ID,
            opt_fields=('user.email', 'user.name'),
        )).get('data') or ()

        task_data = await get_task_data(
            template_url=template_url,
            asana_client=client
        )

        if not task_data:
            logger.info('Forced termination due to missing task data')
            return

        permanent_links_for_users = await create_multiple_tasks(
            emails=get_email_column_values(csv_file_to_dataframe(data_file)),
            asana_client=client,
            project_gid=settings.ASANA_PROJECT_ID,
            task_name=task_data.get('name'),
            notes=task_data.get('notes'),
            members=members,
        )

    logger.info('Done!')
    return permanent_links_for_users


if __name__ == '__main__':
    fire.Fire({'likes': count_likes, 'mailing': create_mailing_tasks})
