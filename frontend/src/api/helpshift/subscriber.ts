import {ApiClient, ApiResponse} from "../client";
import {helpshiftApiKey} from "../../templates/consts";


export type CreateSubscriberDto = {
    name: string
    phone: string
    sms: boolean
    calls: boolean
}
export type CreatedSubscriberDto = unknown

export type UpdateSubscriberDto = CreateSubscriberDto & { id: number }
export type UpdatedSubscriberDto = unknown

export type DeletedSubscriberDto = unknown

export type Subscriber = UpdateSubscriberDto

export class SubscribersApiClient extends ApiClient {

    async getAll(limitId: number | string): Promise<ApiResponse<Subscriber[]>> {
        return this._get<Subscriber[]>({
            endpoint: `/api/Subscribers/${limitId}`,
            headers: {'Apikey': helpshiftApiKey},
        })
    }

    async new(
        limitId: number | string,
        subscriber: CreateSubscriberDto
    ): Promise<ApiResponse<CreatedSubscriberDto>> {
        return this._post<CreatedSubscriberDto>({
            endpoint: `/api/Subscribers/${limitId}`,
            headers: {'Apikey': helpshiftApiKey},
            body: subscriber,
            excludeJson: true,
        })
    }

    async update(
        limitId: number | string,
        subscriber: UpdateSubscriberDto
    ): Promise<ApiResponse<UpdatedSubscriberDto>> {
        return this._put<UpdatedSubscriberDto>({
            endpoint: `/api/Subscribers/${limitId}`,
            headers: {'Apikey': helpshiftApiKey},
            body: {
                ...subscriber,
                limitId: limitId,
            },
            excludeJson: true,
        })
    }

    async delete(
        limitId: number | string,
        subscriberId: number | string
    ): Promise<ApiResponse<DeletedSubscriberDto>> {
        return this._delete<DeletedSubscriberDto>({
            endpoint: `/api/Subscribers/${limitId}/${subscriberId}`,
            headers: {'Apikey': helpshiftApiKey},
            excludeJson: true,
        })
    }
}