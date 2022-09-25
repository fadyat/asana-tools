import logging

from fastapi import (
    FastAPI,
    requests,
    responses,
)

from src.config.api import HttpApiConfig
from src.config.asana import AsanaConfig

__all__ = (
    'Application',
    'Request',
    'RedirectResponse',
    'Logger',
)


class Application(FastAPI):
    logger: logging.Logger
    config: HttpApiConfig
    asana_config: AsanaConfig


class Request(requests.Request):
    app: Application


Logger = logging.Logger
Response = responses.Response
RedirectResponse = responses.RedirectResponse
JSONResponse = responses.JSONResponse
