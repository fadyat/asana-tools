import dataclasses
import datetime
import typing

import pydantic


@dataclasses.dataclass
class RenderingContent:
    name: str
    email: str

    def set_dynamic_fields(
        self,
        content: typing.Mapping,
    ) -> 'RenderingContent':
        for key, value in content.items():
            if isinstance(value, str):
                value = value.strip()

            setattr(self, key, value)

        return self


@dataclasses.dataclass
class TaskPermanentLink:
    name: str
    link: str


@dataclasses.dataclass
class AsanaTaskBasicObject:
    approval_status: str | None = None
    assignee: str | None = None
    assignee_section: str | None = None
    assignee_status: str | None = None
    completed: bool | None = None
    completed_by: typing.Mapping[str, typing.Any] | None = None
    custom_fields: typing.Mapping[str, typing.Mapping[str, typing.Any]] | None = None
    due_at: str | None = None
    due_on: str | None = None
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

    def asdict(self) -> typing.Mapping[str, typing.Any]:
        return self.__dict__


class ReportData(pydantic.BaseModel):
    contractor_project: str
    completed_since: str
    completed_before: str
    report_project: str | None = None
