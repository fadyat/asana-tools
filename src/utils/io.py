import json


def get_task_notes_from_file(
    template_file: str | None,
) -> str | None:
    data = file_to_dictionary(template_file)
    return data.get('notes')


def file_to_dictionary(
    file_path: str | None = None,
) -> dict:
    if not file_path:
        return {}

    with open(file_path, 'r') as f:
        return json.load(f)
