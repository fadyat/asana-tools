import logging


class _CustomFormatter(logging.Formatter):
    grey: str = '\x1b[38;20m'
    yellow: str = '\x1b[33;20m'
    red: str = '\x1b[31;20m'
    bold_red: str = '\x1b[31;1m'
    reset: str = '\x1b[0m'
    format: str = (
        '%(asctime)s - %(name)s - %(levelname)s - %(message)s (%(filename)s:%(lineno)d)'
    )
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


def create_logger(name: str) -> logging.Logger:
    logger = logging.getLogger(name)
    logger.setLevel(logging.DEBUG)
    logger.addHandler(_CustomHandler())
    logger.propagate = False
    return logger
