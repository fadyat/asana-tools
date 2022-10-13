from fastapi import applications, encoders
from fastapi.middleware import cors
from starlette import exceptions
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint

from src import typedef, errors

__all__ = ('setup',)


def exception_handler(
    request: typedef.Request, exc: Exception,
) -> typedef.JSONResponse:
    logs = request.app.logger
    logs.exception(str(exc))

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


class AuthMiddleware(BaseHTTPMiddleware):
    def __init__(self, app: typedef.Application):
        super().__init__(app)

    async def dispatch(
        self, request: typedef.Request, call_next: RequestResponseEndpoint,
    ) -> typedef.Response:
        logged = request.cookies.get('access_token')

        if logged:
            return await call_next(request)

        endpoint = request.url.path
        if endpoint == '/auth' or endpoint.startswith('/api'):
            return await call_next(request)

        return typedef.RedirectResponse(
            url='/auth',
            headers=request.headers
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
    # app.add_middleware(
    #     middleware_class=AuthMiddleware,
    # )
    app.add_middleware(
        middleware_class=cors.CORSMiddleware,
        allow_origins=['*'],
        allow_methods=['*'],
        allow_headers=['*'],
    )
