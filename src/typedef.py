import logging

from fastapi import FastAPI, Request as FastApiRequest

from src.config.api import HttpApiConfig
from src.config.asana import AsanaConfig

__all__ = (
    'Application', 'Request',
)


class Application(FastAPI):
    logger: logging.Logger
    config: HttpApiConfig
    asana_config: AsanaConfig


class Request(FastApiRequest):
    app: Application
