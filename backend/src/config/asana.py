import dataclasses

from src import settings


@dataclasses.dataclass
class AsanaConfig:
    asana_api_endpoint: str
    asana_auth_endpoint: str
    asana_token_endpoint: str


def create_asana_config(
    asana_api_endpoint: str = settings.ASANA_API_ENDPOINT,
):
    return AsanaConfig(
        asana_api_endpoint=asana_api_endpoint,
        asana_auth_endpoint=settings.ASANA_AUTH_ENDPOINT,
        asana_token_endpoint=settings.ASANA_TOKEN_ENDPOINT,
    )
