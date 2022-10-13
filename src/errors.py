import dataclasses


class AsanaError(Exception):
    def __init__(self, message, status_code=500):
        self.message = message
        self.status_code = status_code
        super().__init__(self.message)

    def __str__(self):
        return self.message


class AsanaApiError(AsanaError):
    pass


class AsanaInvalidParameterError(AsanaError):
    status_code = 400


@dataclasses.dataclass  # todo: to another file
class Error:
    message: str
    error_code: str = 'UNKNOWN_ERROR'  # todo: add error codes


@dataclasses.dataclass  # todo: to another file
class ErrorResponse:
    error: Error
