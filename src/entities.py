import dataclasses
import typing


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
class AsanaTaskConfig:
    name: str
    project_gid: str
    notes: str | None = None

    def __post_init__(self):
        self.notes = self.notes or {}
