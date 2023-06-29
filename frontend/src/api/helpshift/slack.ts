export type SlackChannel = {
    id: number,
    name: string,
    type: string,
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