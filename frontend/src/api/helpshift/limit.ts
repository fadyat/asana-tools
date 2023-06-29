import {Subscriber} from "./subscriber";

export type ProjectLimit = {
    id: number
    name: string
    daysOfWeek: string[]
    timeOfDay: string
    duration: string
    pollingInterval: string
    isEnabled: boolean
    smsLimit: number
    callLimit: number
    projectId: number
    subscribers: Subscriber[]
}

export const getProjectLimits = async (
    helpshiftToolsUrl: string, helpshiftApiKey: string, projectId: number | string
): Promise<ProjectLimit[]> => {
    const projectsEndpoint = `${helpshiftToolsUrl}/api/Limits/${projectId}`

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

export const getProjectLimit = async (
    helpshiftToolsUrl: string, helpshiftApiKey: string, projectId: number | string, limitId: number | string
): Promise<ProjectLimit | undefined> => {
    const projectsEndpoint = `${helpshiftToolsUrl}/api/Limits/${projectId}/${limitId}`

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
        return undefined
    }

    if (!response.ok) {
        return undefined
    }

    return await response.json()
}


// backend don't return any response, it's just a custom wrapper for
// rendering error message
export type CreateProjectLimitResponse = {
    ok: boolean
    error?: string
    id?: number
}

export type CreateProjectLimit = {
    name: string
    daysOfWeek: string[]
    timeOfDay: string
    duration: string
    pollingInterval: string
    isEnabled: boolean
    smsLimit: number
    callLimit: number
    projectId: number
}


export const createProjectLimit = async (
    helpshiftToolsUrl: string, helpshiftApiKey: string, limit: CreateProjectLimit
): Promise<CreateProjectLimitResponse> => {
    const projectsEndpoint = `${helpshiftToolsUrl}/api/Limits/${limit.projectId}`

    let response: Response;
    try {
        response = await fetch(projectsEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Apikey': helpshiftApiKey
            },
            credentials: 'include',
            body: JSON.stringify(limit)
        });
    } catch (TypeError) {
        return {
            ok: false,
            error: 'Network error'
        }
    }

    return {
        ok: response.ok,
        error: response.ok ? undefined : JSON.stringify(await response.json()),
        id: response.ok ? await response.json() : undefined
    }
}


export type UpdateProjectLimit = CreateProjectLimit & { id: number }

// backend don't return any response, it's just a custom wrapper for
// rendering error message
export type UpdateProjectLimitResponse = {
    ok: boolean
    error?: string
}

export const updateProjectLimit = async (
    helpshiftToolsUrl: string, helpshiftApiKey: string, limit: UpdateProjectLimit
): Promise<UpdateProjectLimitResponse> => {
    const projectsEndpoint = `${helpshiftToolsUrl}/api/Limits/${limit.projectId}`

    let response: Response;
    try {
        response = await fetch(projectsEndpoint, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Apikey': helpshiftApiKey
            },
            credentials: 'include',
            body: JSON.stringify(limit)
        });
    } catch (TypeError) {
        return {
            ok: false,
            error: 'Network error'
        }
    }

    return {
        ok: response.ok,
        error: response.ok ? undefined : JSON.stringify(await response.json())
    }
}

// backend don't return any response, it's just a custom wrapper for
// rendering error message
export type DeleteProjectLimitResponse = {
    ok: boolean
    error?: string
}

export const deleteProjectLimit = async (
    helpshiftToolsUrl: string, helpshiftApiKey: string, projectId: number | string, limitId: number | string
): Promise<DeleteProjectLimitResponse> => {
    const projectsEndpoint = `${helpshiftToolsUrl}/api/Limits/${projectId}/${limitId}`

    let response: Response;
    try {
        response = await fetch(projectsEndpoint, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Apikey': helpshiftApiKey
            },
            credentials: 'include',
        });
    } catch (TypeError) {
        return {
            ok: false,
            error: 'Network error'
        }
    }

    return {
        ok: response.ok,
        error: response.ok ? undefined : JSON.stringify(await response.json())
    }
}
