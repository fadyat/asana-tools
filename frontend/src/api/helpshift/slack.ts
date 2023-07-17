export type SlackChannel = {
    id: number,
    name: string,
    type: number,
    url: string,
}

export const getSlackChannels = async (
    helpshiftToolsUrl: string, helpshiftApiKey: string, projectId: number | string
): Promise<SlackChannel[]> => {
    const slackChannelsEndpoint = `${helpshiftToolsUrl}/api/SlackChannels/${projectId}`

    let response: Response;
    try {
        response = await fetch(slackChannelsEndpoint, {
            headers: {
                'Content-Type': 'application/json',
                'Apikey': helpshiftApiKey
            },
            credentials: 'include',
        });
    } catch (TypeError) {
        return []
    }

    if (!response.ok) {
        return []
    }

    return await response.json()
}

export type CreateSlackChannel = {
    name: string,
    type: number,
    url: string,
}

// backend don't return any response, it's just a custom wrapper for
// rendering error message
export type CreateProjectLimitResponse = {
    ok: boolean
    error?: string
}

export const createSlackChannel = async (
    helpshiftToolsUrl: string,
    helpshiftApiKey: string,
    projectId: number | string,
    slackChannel: CreateSlackChannel,
): Promise<CreateProjectLimitResponse> => {
    const slackChannelsEndpoint = `${helpshiftToolsUrl}/api/SlackChannels/${projectId}`

    let response: Response;
    try {
        response = await fetch(slackChannelsEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Apikey': helpshiftApiKey,
            },
            credentials: 'include',
            body: JSON.stringify(slackChannel),
        });
    } catch (TypeError) {
        return {
            ok: false,
            error: 'Network error',
        }
    }

    return {
        ok: response.ok,
        error: response.ok ? undefined : JSON.stringify(await response.json()),
    }
}

// backend don't return any response, it's just a custom wrapper for
// rendering error message
export type DeleteSlackChannelResponse = {
    ok: boolean
    error?: string
}

export const deleteSlackChannel = async (
    helpshiftToolsUrl: string,
    helpshiftApiKey: string,
    projectId: number | string,
    channelId: number | string,
): Promise<DeleteSlackChannelResponse> => {
    const slackChannelsEndpoint = `${helpshiftToolsUrl}/api/SlackChannels/${projectId}/${channelId}`

    let response: Response;
    try {
        response = await fetch(slackChannelsEndpoint, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Apikey': helpshiftApiKey,
            },
            credentials: 'include',
        });
    } catch (TypeError) {
        return {
            ok: false,
            error: 'Network error',
        }
    }

    return {
        ok: response.ok,
        error: response.ok ? undefined : JSON.stringify(await response.json()),
    }
}

export type UpdateSlackChannel = CreateSlackChannel & { id: number }

// backend don't return any response, it's just a custom wrapper for
// rendering error message
export type UpdateSlackChannelResponse = {
    ok: boolean
    error?: string
}

export const updateSlackChannel = async (
    helpshiftToolsUrl: string,
    helpshiftApiKey: string,
    projectId: number | string,
    slackChannel: UpdateSlackChannel,
): Promise<UpdateSlackChannelResponse> => {
    const slackChannelsEndpoint = `${helpshiftToolsUrl}/api/SlackChannels/${projectId}/${slackChannel.id}`

    let response: Response;
    try {
        response = await fetch(slackChannelsEndpoint, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Apikey': helpshiftApiKey,
            },
            credentials: 'include',
            body: JSON.stringify(slackChannel),
        });
    } catch (TypeError) {
        return {
            ok: false,
            error: 'Network error',
        }
    }

    return {
        ok: response.ok,
        error: response.ok ? undefined : JSON.stringify(await response.json()),
    }
}