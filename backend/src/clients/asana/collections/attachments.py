import typing

from src.clients.asana.collections.base import AsyncAsanaCollection


class AsyncAsanaAttachmentsCollection(AsyncAsanaCollection):
    async def get_attachment(
        self,
        attachment_gid: str,
        opt_fields: typing.Sequence[str] | None = None,
        opt_pretty: bool | None = None,
    ):
        """https://developers.asana.com/docs/get-an-attachment"""

        params = {
            'opt_fields': opt_fields,
            'opt_pretty': opt_pretty,
        }

        return await self._client.get(
            endpoint=f'attachments/{attachment_gid}',
            params=params,
        )

    async def upload_attachment(
        self,
        parent: str,
        file: bytes | typing.BinaryIO | None = None,
        name: str | None = None,
        resource_subtype: str = 'asana',
        url: str | None = None,
    ):
        """https://developers.asana.com/docs/upload-an-attachment"""

        body = {
            'data': {
                'file': file,
                'name': name,
                'parent': parent,
                'resource_subtype': resource_subtype,
                'url': url,
            },
        }

        return await self._client.post(
            endpoint='attachments',
            body=body,
        )
