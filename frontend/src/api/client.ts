export type ApiRequest = {
    endpoint: string
    body?: any
    headers?: any

    // set to `true` if in response you not expect JSON
    // `data?: T will` be undefined
    excludeJson?: boolean
}

type apiRequest = { method: string } & ApiRequest

export type ApiResponse<T> = {
    ok: boolean
    error?: string
    data?: T
}

export class ApiClient {
    private readonly url: string

    constructor(url: string) {
        this.url = url
    }

    private async makeRequest<T>(request: apiRequest): Promise<ApiResponse<T>> {
        const {endpoint, method, body, headers, excludeJson} = request

        let httpResponse: Response
        try {
            httpResponse = await fetch(`${this.url}${endpoint}`, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    ...headers,
                },
                credentials: 'include',
                body: body ? JSON.stringify(body) : undefined,
            })
        } catch (err: unknown) {
            return {
                ok: false,
                error: (err as Error).message,
            }
        }

        return {
            ok: httpResponse.ok,
            error: httpResponse.ok ? undefined : JSON.stringify(await httpResponse.json()),
            data: httpResponse.ok && !excludeJson ? await httpResponse.json() : undefined,
        }
    }

    protected async _get<T>(request: ApiRequest): Promise<ApiResponse<T>> {
        return this.makeRequest<T>({...request, method: 'GET'})
    }

    protected async _post<T>(request: ApiRequest): Promise<ApiResponse<T>> {
        return this.makeRequest<T>({...request, method: 'POST'})
    }

    protected async _put<T>(request: ApiRequest): Promise<ApiResponse<T>> {
        return this.makeRequest<T>({...request, method: 'PUT'})
    }

    protected async _delete<T>(request: ApiRequest): Promise<ApiResponse<T>> {
        return this.makeRequest<T>({...request, method: 'DELETE'})
    }

    protected async _patch<T>(request: ApiRequest): Promise<ApiResponse<T>> {
        return this.makeRequest<T>({...request, method: 'PATCH'})
    }
}