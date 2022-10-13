import dataclasses

from src import settings


@dataclasses.dataclass
class HttpApiConfig:
    application_name: str
    application_description: str
    application_version: str


def create_api_config(
    app_name: str = settings.APPLICATION_NAME,
    app_description: str = settings.APPLICATION_DESCRIPTION,
    app_version: str = settings.APPLICATION_VERSION,
):
    return HttpApiConfig(
        application_name=app_name,
        application_description=app_description,
        application_version=app_version,
    )
