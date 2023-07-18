import {ApiClient, ApiResponse} from "../client";
import {helpshiftApiKey} from "../../templates/consts";

export type Project = {
    id: number
    name: string
}

export class ProjectApiClient extends ApiClient {

    async getAll(): Promise<ApiResponse<Project[]>> {
        return await this._get<Project[]>({
            endpoint: '/api/Projects',
            headers: {'Apikey': helpshiftApiKey},
        })
    }
}