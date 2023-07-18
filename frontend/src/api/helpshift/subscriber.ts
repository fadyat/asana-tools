export type Subscriber = {
    id: number
    name: string
    phone: string
    sms: boolean
    calls: boolean
}

export const getLimitSubs = async (
    helpshiftToolsUrl: string, helpshiftApiKey: string, limitId: number | string
): Promise<Subscriber[]> => {
    const projectsEndpoint = `${helpshiftToolsUrl}/api/Subscribers/${limitId}`

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

// backend don't return any response, it's just a custom wrapper for
// rendering error message
export type CreateSubscriberResponse = {
    ok: boolean
    error?: string
}

export const createSubscriber = async (
    helpshiftToolsUrl: string,
    helpshiftApiKey: string,
    limitId: number | string,
    subscriber: CreateSubscriber,
): Promise<CreateSubscriberResponse> => {
    const subscribersEndpoint = `${helpshiftToolsUrl}/api/Subscribers/${limitId}`

    let response: Response;
    try {
        response = await fetch(subscribersEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Apikey': helpshiftApiKey,
            },
            credentials: 'include',
            body: JSON.stringify(subscriber),
        });
    } catch (TypeError) {
        return {ok: false, error: 'Network error'}
    }

    return {
        ok: response.ok,
        error: response.ok ? undefined : JSON.stringify(await response.json()),
    }
}

// backend don't return any response, it's just a custom wrapper for
// rendering error message
export type DeleteSubscriberResponse = {
    ok: boolean
    error?: string
}

export const deleteSubscriber = async (
    helpshiftToolsUrl: string,
    helpshiftApiKey: string,
    limitId: number | string,
    subscriberId: number | string,
): Promise<DeleteSubscriberResponse> => {
    const subscribersEndpoint = `${helpshiftToolsUrl}/api/Subscribers/${limitId}/${subscriberId}`

    let response: Response;
    try {
        response = await fetch(subscribersEndpoint, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Apikey': helpshiftApiKey,
            },
            credentials: 'include',
        });
    } catch (TypeError) {
        return {ok: false, error: 'Network error'}
    }

    return {
        ok: response.ok,
        error: response.ok ? undefined : JSON.stringify(await response.json()),
    }
}


export type UpdateSubscriber = CreateSubscriber & { id: number }

// backend don't return any response, it's just a custom wrapper for
// rendering error message
export type UpdateSubscriberResponse = {
    ok: boolean
    error?: string
}

export const updateSubscriber = async (
    helpshiftToolsUrl: string,
    helpshiftApiKey: string,
    limitId: number | string,
    subscriber: UpdateSubscriber,
): Promise<UpdateSubscriberResponse> => {
    const subscribersEndpoint = `${helpshiftToolsUrl}/api/Subscribers/${limitId}`

    let response: Response;
    try {
        response = await fetch(subscribersEndpoint, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Apikey': helpshiftApiKey,
            },
            credentials: 'include',
            body: JSON.stringify({...subscriber, limitId: limitId}),
        });
    } catch (TypeError) {
        return {ok: false, error: 'Network error'}
    }

    return {
        ok: response.ok,
        error: response.ok ? undefined : JSON.stringify(await response.json()),
    }
}