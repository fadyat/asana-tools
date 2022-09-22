__all__ = ('get_assignee_name',)


def get_assignee_name(members, email) -> str | None:
    for member in members:
        user = member.get('user') or {}
        if user.get('email') == email:
            return user.get('name')

    return None
