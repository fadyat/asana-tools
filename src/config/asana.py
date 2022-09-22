import dataclasses

from src import settings


@dataclasses.dataclass
class AsanaTaskConfig:
    name: str
    project_gid: str
    notes: str | None = None

    def __post_init__(self):
        self.notes = self.notes or {}


@dataclasses.dataclass
class AsanaConfig:
    asana_api_endpoint: str


def create_asana_config(
    asana_api_endpoint: str = settings.ASANA_API_ENDPOINT,
):
    return AsanaConfig(
        asana_api_endpoint=asana_api_endpoint,
    )
