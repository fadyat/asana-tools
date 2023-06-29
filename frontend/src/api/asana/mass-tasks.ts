import {validationErrorResponse} from "./activity";

export type massTasksRequest = {
    asana_template_url: string,
    uploaded_file: File | null
}

export type MassTasksErrorResponse = {
    error: { message: string }
}

export type MassTasksSuccessResponse = {
    created_tasks: asanaTask[],
    failed_tasks: {
        task: asanaTask,
        error: string
    }[]
}

export type asanaTask = {
    gid: string,
    name: string,
    permalink_url: string,
}

const createTasksByTemplate = async (asanaToolsUrl: string, body: massTasksRequest)
    : Promise<MassTasksSuccessResponse | MassTasksErrorResponse> => {
    const massTasksEndpoint = `${asanaToolsUrl}/api/v1/tasks/by_template`

    const formData = new FormData();
    formData.append('asana_template_url', body.asana_template_url);
    formData.append('uploaded_file', body.uploaded_file as Blob);

    let response: Response;
    try {
        response = await fetch(massTasksEndpoint, {
            method: 'POST',
            credentials: 'include',
            body: formData
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

export default createTasksByTemplate;