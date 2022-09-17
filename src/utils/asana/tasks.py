from typing import Sequence

import aiohttp
import pandas

from src.clients.asana import AsyncAsanaClient
from src.entities import RenderingContent
from src.utils import filters
from src.utils.base.log import create_logger
from src.utils.render import replace_all_text_templates

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
    dataframe: pandas.DataFrame,
    asana_client: AsyncAsanaClient,
    project_gid: str,
    notes: str,
    task_name: str,
    members: Sequence[dict],
):
    permanent_links_for_users = []
    for _, row in dataframe.iterrows():
        rendering_content = RenderingContent(
            name=get_assignee_name(members, row.email),
            email=row.email,
        ).set_dynamic_fields(row.to_dict())

        try:
            result = await asana_client.create_task(
                name=replace_all_text_templates(task_name, rendering_content),
                project_gid=project_gid,
                notes=replace_all_text_templates(notes, rendering_content),
                assignee=row.email,
            )
        except (aiohttp.ContentTypeError, aiohttp.ClientError, Exception):
            logger.exception('Failed to create task for %s', row.email)
            continue

        data = result.get('data') or {}
        logger.info('Created task %s', data.get('gid'))
        permanent_links_for_users.append(
            (rendering_content.name, data.get('permalink_url'))
        )

    return permanent_links_for_users
