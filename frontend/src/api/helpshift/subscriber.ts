export type Subscriber = {
    id: number
    name: string
    phone: string
    sms: boolean
    calls: boolean
}

export const getProjectSubscribers = async (
    helpshiftToolsUrl: string, helpshiftApiKey: string, projectId: number | string
): Promise<Subscriber[]> => {
    const projectsEndpoint = `${helpshiftToolsUrl}/api/Subscribers/${projectId}`

    let response: Response;
    try {
        response = await fetch(projectsEndpoint, {
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

export type CreateSubscriber = {
    name: string
    phone: string
    sms: boolean
    calls: boolean
}
