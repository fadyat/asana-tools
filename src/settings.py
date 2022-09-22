from envparse import env

env.read_envfile()

# Default
LOG_LEVEL = env.str('LOG_LEVEL', default='INFO')
CSV_SEPERATOR = env.str('PANDAS_SEPERATOR', default=';')
ASANA_API_ENDPOINT = env.str(
    'ASANA_API_ENDPOINT', default='https://app.asana.com/api/1.0'
)

# Backend
APPLICATION_NAME = env.str('APPLICATION_NAME', default='name')
APPLICATION_DESCRIPTION = env.str('APPLICATION_DESCRIPTION', default='description')
APPLICATION_VERSION = env.str('APPLICATION_VERSION', default='v1')
API_PORT = env.int('API_PORT', default=80)
API_WORKERS_COUNT = env.int('API_WORKERS_COUNT', default=1)
