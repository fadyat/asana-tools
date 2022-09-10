from envparse import env

env.read_envfile()

ASANA_API_KEY = env.str('ASANA_API_KEY')
ASANA_API_ENDPOINT = env.str(
    'ASANA_API_ENDPOINT',
    default='https://app.asana.com/api/1.0',
)


def get_asana_project_gid_from_url(
    url: str,
) -> str:
    return list(filter(lambda x: x.isdigit(), url.split('/')))[1]


ASANA_PROJECT_ID = get_asana_project_gid_from_url(env.str('ASANA_PROJECT_URL'))
ASANA_LIKES_FIELD_ID = env.str('ASANA_LIKES_FIELD_ID')
ASANA_TASK_TEMPLATE_URL = env.str('ASANA_TASK_TEMPLATE_URL')
DATA_CSV_FILE_NAME = env.str('DATA_CSV_FILE_NAME', default='test.csv')
