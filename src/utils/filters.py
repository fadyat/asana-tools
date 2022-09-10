def remove_none_values(
    body: dict,
) -> dict:
    return {key: value for key, value in body.get('data').items() if value}


def parse_task_gid_from_url(
    url: str | None,
) -> str:
    return list(filter(lambda x: x.isdigit(), url.split('/')))[-1]
