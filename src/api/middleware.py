from fastapi import applications
from fastapi.middleware import cors
from starlette import exceptions

__all__ = ('setup',)


# def exception_handler(request: typedef.Request, exc: Exception) -> typedef.JsonResponse:
#     logger: typedef.Logger = getattr(request.state, 'logger', None) or request.app.logger
#     if isinstance(exc, typedef.INFO_LEVEL_EXCEPTIONS):
#         logger.info(dict(message=str(exc)))
#     else:
#         logger.exception(str(exc))
#
#     return json_response(
#         content=scheme.responses.ErrorResponse(
#             error=scheme.responses.Error(
#                 message=getattr(exc, 'message', None) or str(exc),
#                 code=getattr(exc, 'error_code', None) or error_codes.UNKNOWN,
#             )
#         ),
#         status_code=getattr(exc, 'status_code', None) or 500,
#     )


# class LoggerMiddleware(BaseHTTPMiddleware):
#
#     async def dispatch(
#         self,
#         request: typedef.Request,
#         call_next: RequestResponseEndpoint
#     ) -> typedef.Response:
#         trace_id = request.headers.get('X-Trace-Id') or ext.web.generate_trace_id()
#         logger = enviroment.logger.create_logger(request.app.logger, dict(trace_id=trace_id))
#         request.state.logger = logger
#         request.state.trace_id = trace_id
#         start_time = ext.web.get_current_time()
#         logger = enviroment.logger.create_logger(logger, dict(
#             path=request.url.path,
#             method=request.method
#         ))
#         logger.debug(dict(message='Endpoint requested'))
#         response = await call_next(request)
#         logger.debug(dict(
#             message='Endpoint request completed',
#             status_code=response.status_code,
#             process_time=str(ext.web.get_current_time() - start_time)
#         ))
#
#         return response


def setup(
    app: applications.FastAPI,
):
    app.add_middleware(
        middleware_class=exceptions.ExceptionMiddleware,
        handlers=app.exception_handlers,
    )
    # app.add_exception_handler(
    #     exc_class_or_status_code=Exception,
    #     handler=exception_handler
    # )
    # app.add_middleware(
    #     middleware_class=LoggerMiddleware
    # )
    # app.add_middleware(
    #     middleware_class=AuthMiddleware
    # )
    # app.add_middleware(
    #     middleware_class=DatabaseMiddleware
    # )
    app.add_middleware(
        middleware_class=cors.CORSMiddleware,
        allow_origins=['*'],
        allow_methods=['*'],
        allow_headers=['*'],
    )
