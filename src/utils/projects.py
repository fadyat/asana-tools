def get_custom_fields(
    project_response: dict,
):
    data = project_response.get('data') or {}
    return data.get('custom_field_settings') or ()
