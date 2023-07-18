import {ApiClient, ApiResponse} from "../client";
import {helpshiftApiKey} from "../../templates/consts";

export type CreateSlackChannelDto = {
    name: string,
    type: number,
    url: string,
}
export type CreatedSlackChannelDto = unknown

export type UpdateSlackChannelDto = CreateSlackChannelDto & { id: number }
export type UpdatedSlackChannelDto = unknown

export type DeletedSlackChannelDto = unknown

export type SlackChannel = UpdateSlackChannelDto

export class SlackChannelApiClient extends ApiClient {

    async getAll(projectId: number | string): Promise<ApiResponse<SlackChannel[]>> {
        return await this._get<SlackChannel[]>({
            endpoint: `/api/SlackChannels/${projectId}`,
            headers: {'Apikey': helpshiftApiKey},
        })
    }

    async new(
        projectId: number | string,
        channel: CreateSlackChannelDto
    ): Promise<ApiResponse<CreatedSlackChannelDto>> {
        return await this._post<CreatedSlackChannelDto>({
            endpoint: `/api/SlackChannels/${projectId}`,
            headers: {'Apikey': helpshiftApiKey},
            body: channel,
            excludeJson: true,
        })
    }

    async update(
        projectId: number | string,
        channel: UpdateSlackChannelDto
    ): Promise<ApiResponse<UpdatedSlackChannelDto>> {
        return await this._put<UpdatedSlackChannelDto>({
            endpoint: `/api/SlackChannels/${projectId}/${channel.id}`,
            headers: {'Apikey': helpshiftApiKey},
            body: channel,
            excludeJson: true,
        })
    }

    async delete(
        projectId: number | string,
        channelId: number | string,
    ): Promise<ApiResponse<DeletedSlackChannelDto>> {
        return await this._delete<DeletedSlackChannelDto>({
            endpoint: `/api/SlackChannels/${projectId}/${channelId}`,
            headers: {'Apikey': helpshiftApiKey},
            excludeJson: true,
        })
    }
}