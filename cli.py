import fire

from src import settings
from src.clients.asana.client import AsyncAsanaClient
from src.clients.asana.handlers.projects import process_members_response
from src.clients.asana.handlers.tasks import (
    process_task_response,
    process_multiple_tasks_creation,
)
from src.entities import AsanaTaskConfig
from src.utils import log
from src.utils.io import csv_file_to_dataframe


async def create_mailing_tasks(
    data_file: str = settings.DATA_CSV_FILE_NAME,
    project_gid: str = settings.ASANA_PROJECT_ID,
    task_gid: str = settings.ASANA_TASK_GID,
    asana_api_key: str = settings.ASANA_API_KEY,
    asana_api_endpoint: str = settings.ASANA_API_ENDPOINT,
):
    logs = log.logger
    logs.info('Start creating mailing tasks')
    async with AsyncAsanaClient(asana_api_key, asana_api_endpoint) as client:
        members_data = await process_members_response(project_gid, client)
        task_data = await process_task_response(task_gid, client)

    dataframe = csv_file_to_dataframe(data_file)
    task_config = AsanaTaskConfig(
        name=task_data.get('name'),
        notes=task_data.get('notes'),
        project_gid=project_gid,
    )
    async with AsyncAsanaClient(asana_api_key, asana_api_endpoint) as client:
        permanent_links_for_users = await process_multiple_tasks_creation(
            dataframe=dataframe,
            asana_client=client,
            members=members_data,
            task_config=task_config,
        )

    logs.info('Finish creating mailing tasks')
    return permanent_links_for_users


if __name__ == '__main__':
    fire.Fire({'mailing': create_mailing_tasks})
