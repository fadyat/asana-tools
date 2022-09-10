def asana_api_errors(f):
    async def inner(*args, **kwargs):
        response: dict = await f(*args, **kwargs)
        if errors := response.get('errors'):
            raise Exception(errors)  # todo: change exception type

        return response

    return inner
