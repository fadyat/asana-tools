from src.api.runner import create_app
from src.config.api import create_api_config
from src.config.asana import create_asana_config

app = create_app(
    config=create_api_config(),
    asana_config=create_asana_config(),
)
