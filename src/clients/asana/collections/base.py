from src.clients.asana.component import AsyncAsanaClientComponent

__all__ = ('AsyncAsanaCollection',)


class AsyncAsanaCollection:
    def __init__(
        self,
        asana_client: AsyncAsanaClientComponent,
    ):
        self._client = asana_client
