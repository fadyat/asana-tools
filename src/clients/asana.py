import json
import types
import typing

import aiohttp

from src import settings


class AsyncAsanaClient:
    def __init__(
        self,
        access_token: str,
        asana_api_endpoint: str = settings.ASANA_API_ENDPOINT,
        http_session: aiohttp.ClientSession | None = None,
    ):
        self.http_session = http_session or aiohttp.ClientSession()
        self.access_token = access_token
        self.api_endpoint = asana_api_endpoint

    @property
    def headers(self):
        return {"Authorization": f"Bearer {self.access_token}"}

    async def get_project(
        self,
        project_gid: str,
    ):
        response = await self.http_session.get(
            url=f"{self.api_endpoint}/projects/{project_gid}",
            headers=self.headers,
        )

        return await response.json()

    async def get_tasks(
        self,
        project_gid: str,
    ):
        response = await self.http_session.get(
            url=f"{self.api_endpoint}/tasks",
            params={'project': project_gid},
            headers=self.headers,
        )

        return await response.json()

    async def get_task(
        self,
        task_gid: str,
    ):
        response = await self.http_session.get(
            url=f"{self.api_endpoint}/tasks/{task_gid}",
            headers=self.headers,
        )

        return await response.json()

    async def update_tasks_likes_field(
        self,
        task_gid: str,
        likes_field_gid: str,
        likes_count: int,
    ):
        body = {"data": {"custom_fields": {likes_field_gid: likes_count}}}

        response = await self.http_session.put(
            url=f"{self.api_endpoint}/tasks/{task_gid}",
            headers=self.headers,
            data=json.dumps(body),
        )

        return await response.json()

    async def __aenter__(self):
        return self

    async def __aexit__(
        self,
        exc_type: typing.Type[BaseException] | None,
        exc_val: BaseException | None,
        exc_tb: types.TracebackType,
    ) -> None:
        await self.http_session.close()
