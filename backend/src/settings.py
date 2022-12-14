from envparse import env

env.read_envfile()

# For authorization
API_PORT = env.int('API_PORT', default=80)
ASANA_CLIENT_ID = env.str('ASANA_CLIENT_ID')
ASANA_CLIENT_SECRET = env.str('ASANA_CLIENT_SECRET')
ASANA_REDIRECT_URI = env.str(
    'ASANA_REDIRECT_URI', default=f'http://localhost:{API_PORT}/api/v1/callback'
)

# Default
LOG_LEVEL = env.str('LOG_LEVEL', default='INFO')
CSV_SEPERATOR = env.str('PANDAS_SEPERATOR', default=';')
ASANA_API_ENDPOINT = env.str(
    'ASANA_API_ENDPOINT', default='https://app.asana.com/api/1.0'
)
ASANA_AUTH_ENDPOINT = env.str(
    'ASANA_AUTH_ENDPOINT', default='https://app.asana.com/-/oauth_authorize'
)
ASANA_TOKEN_ENDPOINT = env.str(
    'ASANA_TOKEN_ENDPOINT', default='https://app.asana.com/-/oauth_token'
)

# Backend
APPLICATION_NAME = env.str('APPLICATION_NAME', default='Asana scripts backend')
APPLICATION_DESCRIPTION = env.str(
    'APPLICATION_DESCRIPTION', default='Helper for creating mass asana tasks'
)
APPLICATION_VERSION = env.str('APPLICATION_VERSION', default='v1')
API_WORKERS_COUNT = env.int('API_WORKERS_COUNT', default=1)
JWT_SECRET_KEY = env.str('JWT_SECRET_KEY', default='')
JWT_ALGORITHM = env.str('JWT_ALGORITHM', default='HS256')
