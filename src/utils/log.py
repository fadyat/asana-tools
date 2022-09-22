import logging

__all__ = ('logger',)

from src import settings


class _CustomFormatter(logging.Formatter):
    grey: str = '\x1b[38;20m'
    yellow: str = '\x1b[33;20m'
    red: str = '\x1b[31;20m'
    bold_red: str = '\x1b[31;1m'
    reset: str = '\x1b[0m'
    format: str = '%(asctime)s - %(levelname)s - %(message)s'
    FORMATS: dict = {
        logging.DEBUG: grey + format + reset,
        logging.INFO: grey + format + reset,
        logging.WARNING: yellow + format + reset,
        logging.ERROR: red + format + reset,
        logging.CRITICAL: bold_red + format + reset,
    }

    def format(self, record: logging.LogRecord) -> str:
        log_fmt = self.FORMATS.get(record.levelno)
        formatter = logging.Formatter(log_fmt)
        return formatter.format(record)


class _CustomHandler(logging.StreamHandler):
    def __init__(self):
        super().__init__()
        self.formatter = _CustomFormatter()


def __create_logger(
    log_level: str = settings.LOG_LEVEL,
) -> logging.Logger:
    logger = logging.getLogger()
    logger.setLevel(log_level)
    logger.addHandler(_CustomHandler())
    logger.propagate = False
    return logger


logger = __create_logger()
