export type GameProject = {
    id: number
    name: string
}

export const getGameProjects = async (helpshiftToolsUrl: string, helpshiftApiKey: string): Promise<GameProject[]> => {
    const projectsEndpoint = `${helpshiftToolsUrl}/api/Projects`

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