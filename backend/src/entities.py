import dataclasses
import typing

import pydantic

from src.errors import AsanaApiError


@dataclasses.dataclass
class RenderingContent:
    name: str
    email: str
    due_on: typing.Optional[str] = None

    def set_dynamic_fields(
        self,
        content: typing.Mapping,
    ) -> 'RenderingContent':
        for key, value in content.items():
            if isinstance(value, str):
                value = value.strip()

            if not getattr(self, key, None):
                setattr(self, key, value)

        return self


@dataclasses.dataclass
class TaskPermanentLink:
    name: str
    link: str


class AsanaTaskResponse(pydantic.BaseModel):
    gid: str | None = None
    resource_type: str | None = None
    approval_status: str | None = None
    assignee_status: str | None = None
    completed: bool | None = None
    completed_at: str | None = None
    completed_by: typing.Mapping[str, typing.Any] | None = None
    created_at: str | None = None
    dependencies: typing.Sequence[typing.Mapping[str, typing.Any]] | None = None
    dependents: typing.Sequence[typing.Mapping[str, typing.Any]] | None = None
    due_at: str | None = None
    due_on: str | None = None
    external: typing.Mapping[str, typing.Any] | None = None
    hearted: bool | None = None
    hearts: typing.Sequence[typing.Mapping[str, typing.Any]] | None = None
    html_notes: str | None = None
    is_rendered_as_separator: bool | None = None
    liked: bool | None = None
    likes: typing.Sequence[typing.Mapping[str, typing.Any]] | None = None
    memberships: typing.Sequence[typing.Mapping[str, typing.Any]] | None = None
    modified_at: str | None = None
    name: str | None = None
    notes: str | None = None
    num_hearts: int | None = None
    num_likes: int | None = None
    num_subtasks: int | None = None
    resource_subtype: str | None = None
    start_at: str | None = None
    start_on: str | None = None
    assignee: typing.Mapping[str, typing.Any] | None = None
    assignee_section: typing.Mapping[str, typing.Any] | None = None
    custom_fields: typing.Sequence[typing.Mapping[str, typing.Any]] | None = None
    followers: typing.Sequence[typing.Mapping[str, typing.Any]] | None = None
    parent: typing.Mapping[str, typing.Any] | None = None
    permalink_url: str | None = None
    projects: typing.Sequence[typing.Mapping[str, typing.Any]] | None = None
    tags: typing.Sequence[typing.Mapping[str, typing.Any]] | None = None
    workspace: typing.Mapping[str, typing.Any] | None = None


class AsanaTaskRequest(pydantic.BaseModel):
    approval_status: str | None = None
    assignee: str | None = None
    assignee_section: str | None = None
    assignee_status: str | None = None
    completed: bool | None = None
    completed_by: typing.Mapping[str, typing.Any] | None = None
    custom_fields: typing.Mapping[str, typing.Any] | None = None
    due_at: str | None = None # ISO 8601
    due_on: str | None = None # YYYY-MM-DD
    external: typing.Mapping[str, typing.Any] | None = None
    followers: typing.Sequence[str] | None = None
    html_notes: str | None = None
    liked: bool | None = None
    name: str | None = None
    notes: str | None = None
    parent: str | None = None
    projects: typing.Sequence[str] | None = None
    resource_subtype: str | None = None
    start_at: str | None = None
    start_on: str | None = None
    tags: typing.Sequence[str] | None = None
    workspace: str | None = None

    def from_response(
        self,
        asana_task_response: AsanaTaskResponse,
        include_parent: bool = False,
        **opt_fields: typing.Any,
    ):
        if asana_task_response.assignee:
            self.assignee = asana_task_response.assignee['gid']

        if asana_task_response.assignee_section:
            self.assignee_section = asana_task_response.assignee_section['gid']

        self.assignee_status = asana_task_response.assignee_status
        self.approval_status = asana_task_response.approval_status
        self.completed = asana_task_response.completed
        self.completed_by = asana_task_response.completed_by

        if asana_task_response.custom_fields:
            self.custom_fields = {
                cf.get('gid'): cf.get('display_value')
                for cf in asana_task_response.custom_fields
            }

        self.due_at = asana_task_response.due_at
        self.due_on = asana_task_response.due_on
        self.external = asana_task_response.external

        if asana_task_response.followers:
            self.followers = [f.get('gid') for f in asana_task_response.followers]

        self.html_notes = asana_task_response.html_notes
        self.liked = asana_task_response.liked
        self.name = asana_task_response.name
        self.notes = asana_task_response.notes

        if asana_task_response.parent and include_parent:
            self.parent = asana_task_response.parent['gid']

        if asana_task_response.projects:
            self.projects = [p.get('gid') for p in asana_task_response.projects]

        self.resource_subtype = asana_task_response.resource_subtype
        self.start_at = asana_task_response.start_at
        self.start_on = asana_task_response.start_on

        if asana_task_response.tags:
            self.tags = [t.get('gid') for t in asana_task_response.tags]

        if asana_task_response.workspace:
            self.workspace = asana_task_response.workspace['gid']

        for opt_field, opt_value in opt_fields.items():
            setattr(self, opt_field, opt_value)

        return self


class ReportData(pydantic.BaseModel):
    contractor_project: str
    completed_since: str
    completed_before: str
    report_project: str | None = None


class FailedTask(pydantic.BaseModel):
    task: AsanaTaskRequest
    error: str


class ByTemplateResponse(pydantic.BaseModel):
    created_tasks: typing.List[AsanaTaskResponse] = []
    failed_tasks: typing.List[FailedTask] = []

    def add_created_task(self, task: AsanaTaskResponse):
        self.created_tasks.append(task)

    def add_failed_task(self, task: AsanaTaskRequest, err: AsanaApiError):
        self.failed_tasks.append(FailedTask(task=task, error=err.message))
