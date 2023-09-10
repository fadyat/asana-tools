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

    async getAllByProjectID(projectId: number | string): Promise<ApiResponse<SlackChannel[]>> {
        return await this._get<SlackChannel[]>({
            endpoint: `/api/SlackChannels/${projectId}`,
            headers: {'Apikey': helpshiftApiKey},
        })
    }

    async newForProject(
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

    async getAll(): Promise<ApiResponse<SlackChannel[]>> {
        return await this._get<SlackChannel[]>({
            endpoint: '/api/SlackChannels',
            headers: {'Apikey': helpshiftApiKey},
        })
    }

    async newForLimits(
        channel: CreateSlackChannelDto
    ): Promise<ApiResponse<CreatedSlackChannelDto>> {
        return await this._post<CreatedSlackChannelDto>({
            endpoint: `/api/SlackChannels`,
            headers: {'Apikey': helpshiftApiKey},
            body: channel,
            excludeJson: true,
        })
    }

    async updateForProject(
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

    async deleteForProject(
        projectId: number | string,
        channelId: number | string,
    ): Promise<ApiResponse<DeletedSlackChannelDto>> {
        return await this._delete<DeletedSlackChannelDto>({
            endpoint: `/api/SlackChannels/${projectId}/${channelId}`,
            headers: {'Apikey': helpshiftApiKey},
            excludeJson: true,
        })
    }

    async updateForLimits(
        channel: UpdateSlackChannelDto
    ): Promise<ApiResponse<UpdatedSlackChannelDto>> {
        return await this._put<UpdatedSlackChannelDto>({
            endpoint: `/api/SlackChannels/${channel.id}`,
            headers: {'Apikey': helpshiftApiKey},
            body: channel,
            excludeJson: true,
        })
    }

    async deleteForLimits(
        channelId: number | string,
    ): Promise<ApiResponse<DeletedSlackChannelDto>> {
        return await this._delete<DeletedSlackChannelDto>({
            endpoint: `/api/SlackChannels/${channelId}`,
            headers: {'Apikey': helpshiftApiKey},
            excludeJson: true,
        })
    }
}