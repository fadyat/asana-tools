from fastapi import applications, encoders
from fastapi.middleware import cors
from starlette import exceptions

from src import errors
from src import typedef

__all__ = ('setup',)


def exception_handler(
    request: typedef.Request,
    exc: Exception,
) -> typedef.JSONResponse:
    logs = request.app.logger
    logs.info(str(exc))

    return typedef.JSONResponse(
        content=encoders.jsonable_encoder(
            errors.ErrorResponse(
                error=errors.Error(
                    message=getattr(exc, 'message', None) or str(exc),
                    error_code=getattr(exc, 'error_code', None) or 'UNKNOWN_ERROR',
                    # todo: add error codes
                )
            ),
        ),
        status_code=getattr(exc, 'status_code', None) or 500,
    )


def setup(
    app: applications.FastAPI,
):
    app.add_middleware(
        middleware_class=exceptions.ExceptionMiddleware,
        handlers=app.exception_handlers,
    )
    app.add_exception_handler(
        exc_class_or_status_code=Exception,
        handler=exception_handler,
    )
    app.add_middleware(
        middleware_class=cors.CORSMiddleware,
        allow_origins=['*'],
        allow_credentials=True,
        allow_methods=['*'],
        allow_headers=['*'],
    )
