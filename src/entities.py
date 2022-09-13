import dataclasses


@dataclasses.dataclass
class RenderingContent:
    name: str
    email: str
    equipment: str | None = None
