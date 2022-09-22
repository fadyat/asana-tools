import functools

import uvicorn

from src import typedef
from src.api import middleware, fe, be
from src.config.api import HttpApiConfig
from src.config.asana import AsanaConfig
from src.utils import log

__all__ = (
    'create_app',
    'run',
)


def create_app(
    config: HttpApiConfig,
    asana_config: AsanaConfig,
):
    app = typedef.Application(
        title=config.application_name,
        version=config.application_version,
        description=config.application_description,
    )

    app.router.add_event_handler(
        'startup',
        functools.partial(__startup, app, config, asana_config),
    )
    app.router.add_event_handler(
        'shutdown',
        functools.partial(__shutdown, app),
    )
    middleware.setup(app)

    app.include_router(fe.fe_router)
    app.include_router(be.be_router)

    return app


async def __startup(
    application: typedef.Application,
    config: HttpApiConfig,
    asana_config: AsanaConfig,
):
    application.config = config
    application.asana_config = asana_config
    application.logger = log.logger  # todo: change


async def __shutdown(
    application: typedef.Application,
):
    application.config = None
    application.asana_config = None
    application.logger = None


def run(
    port: int = 80,
    workers_count: int = 1,
    reload: bool = False,
):
    if workers_count == 1 and not reload:
        from src.api import instance

        app = instance.app
    else:
        app = 'src.api.instance:app'

    uvicorn.run(
        app=app,
        host='0.0.0.0',
        port=port,
        workers=workers_count,
        reload=reload,
        log_config=None,
    )
