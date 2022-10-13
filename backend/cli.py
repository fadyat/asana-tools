import fire

from src import settings
from src.api import runner


def run_api(
    reload: bool = False,
):
    runner.run(
        port=settings.API_PORT,
        workers_count=settings.API_WORKERS_COUNT,
        reload=reload,
    )


if __name__ == '__main__':
    fire.Fire({'api': run_api})
