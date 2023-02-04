__all__ = ('get_assignee_name', 'get_due_on',)


def get_assignee_name(members, email) -> str | None:
    for member in members:
        user = member.get('user') or {}
        if user.get('email') == email:
            return user.get('name')

    return None


def get_due_on(row) -> str | None:
    return row.get('due_on') or None
