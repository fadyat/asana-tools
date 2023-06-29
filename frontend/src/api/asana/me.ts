export type Me = {
    gid: string
    email: string
    name: string
    photo: {
        image_36x36: string
    }
}

export const getMe = async (asanaToolsUrl: string): Promise<Me | null> => {
    const meEndpoint = `${asanaToolsUrl}/api/v1/users/me`

    let response: Response;
    try {
        response = await fetch(meEndpoint, {
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
        });
    } catch (TypeError) {
        return null;
    }

    if (!response.ok) {
        return null
    }

    return await response.json().then((body) => body.result.user)
}
