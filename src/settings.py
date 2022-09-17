from envparse import env

from src.clients.asana.filters.projects import get_project_gid
from src.clients.asana.filters.tasks import get_task_gid

env.read_envfile()

# Passed
ASANA_API_KEY = env.str('ASANA_API_KEY')
ASANA_PROJECT_URL = env.str('ASANA_PROJECT_URL', default='')
DATA_CSV_FILE_NAME = env.str('DATA_CSV_FILE_NAME', default='tests.csv')

# Processing
ASANA_PROJECT_ID = get_project_gid(ASANA_PROJECT_URL)
ASANA_TASK_GID = get_task_gid(ASANA_PROJECT_URL)

# Default
CSV_SEPERATOR = env.str('PANDAS_SEPERATOR', default=';')
ASANA_API_ENDPOINT = env.str(
    'ASANA_API_ENDPOINT', default='https://app.asana.com/api/1.0'
)
