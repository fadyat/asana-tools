import {Subscriber} from "./subscriber";
import {ApiClient, ApiResponse} from "../client";
import {helpshiftApiKey} from "../../templates/consts";


export type CreateLimitDto = {
    name: string
    daysOfWeek: number[]
    timeOfDay: string
    duration: string
    pollingInterval: string
    isEnabled: boolean
    smsLimit: number
    callLimit: number
    projectId: number
}
export type CreatedLimitDto = { id: number }

export type UpdateLimitDto = CreateLimitDto & CreatedLimitDto
export type UpdatedLimitDto = unknown

export type DeletedLimitDto = unknown

export type Limit = UpdateLimitDto & {
    subscribers: Subscriber[]
}

export class LimitApiClient extends ApiClient {

    async getAll(projectId: number | string): Promise<ApiResponse<Limit[]>> {
        return await this._get<Limit[]>({
            endpoint: `/api/Limits/${projectId}`,
            headers: {'Apikey': helpshiftApiKey},
        })
    }

    async get(projectId: number | string, limitId: number | string): Promise<ApiResponse<Limit>> {
        return await this._get<Limit>({
            endpoint: `/api/Limits/${projectId}/${limitId}`,
            headers: {'Apikey': helpshiftApiKey},
        })
    }

    async new(limit: CreateLimitDto): Promise<ApiResponse<CreatedLimitDto>> {
        return await this._post<CreatedLimitDto>({
            endpoint: `/api/Limits/${limit.projectId}`,
            headers: {'Apikey': helpshiftApiKey},
            body: limit
        })
    }

    async update(limit: UpdateLimitDto): Promise<ApiResponse<UpdatedLimitDto>> {
        return await this._put<UpdateLimitDto>({
            endpoint: `/api/Limits/${limit.projectId}`,
            headers: {'Apikey': helpshiftApiKey},
            body: limit,
            excludeJson: true
        })
    }

    async delete(
        projectId: number | string,
        limitId: number | string,
    ): Promise<ApiResponse<DeletedLimitDto>> {
        return await this._delete<DeletedLimitDto>({
            endpoint: `/api/Limits/${projectId}/${limitId}`,
            headers: {'Apikey': helpshiftApiKey},
            excludeJson: true
        })
    }
}