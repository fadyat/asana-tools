export type activityRequest = {
    completed_before: string,
    completed_since: string,
    project: string
}

export type ActivitySuccessResponse = {
    length: number,
    result: {
        user_email: string,
        actions_cnt: number
    }[]
}

export type ActivityErrorResponse = {
    error: { message: string }
}

export type validationErrorResponse = {
    detail: {
        loc: string[],
        msg: string,
        type: string
    }[]
}


export const checkUserActivity = async (asanaToolsUrl: string, body: activityRequest)
    : Promise<ActivitySuccessResponse | ActivityErrorResponse> => {
    const activityEndpoint = `${asanaToolsUrl}/api/v1/tasks/activity`

    let response: Response;
    try {
        response = await fetch(activityEndpoint, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
            body: JSON.stringify(body)
        })
    } catch (error) {
        return {error: {message: (error as Error).message}};
    }

    return await response.json().then((body) => {
        // eslint-disable-next-line no-prototype-builtins
        if (body.hasOwnProperty('detail')) {
            const message = (body as validationErrorResponse).detail.map((error) => error.msg).join(', ')
            return {error: {message: message}}
        }

        return body
    })
}