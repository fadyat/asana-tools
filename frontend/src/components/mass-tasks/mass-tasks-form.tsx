import {Button, TextField} from "@mui/material";
import React, {useState} from "react";
import PrettyFormControl from "../core/formcontrol";
import createTasksByTemplate, {MassTasksErrorResponse, MassTasksSuccessResponse} from "../../api/asana/mass-tasks";
import {asanaToolsUrl} from "../../templates/consts";
import ApiAlert, {ApiAlertProps} from "../core/api-alert";
import {asanaUrlWithTaskId} from "../../templates/placeholders";
import MassTasksResponse from "./mass-tasks-response";

const MassTasksForm = () => {
    const [templateTask, setTemplateTask] = useState<string>('');
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [apiAlertProps, setApiAlertProps] = useState<ApiAlertProps | null>(null);
    const [apiResponse, setApiResponse] = useState<MassTasksSuccessResponse | null>(null);

    return (
        <div style={{
            display: 'flex',
            width: '70%',
            alignItems: 'center',
            justifyContent: 'center',
            margin: 'auto',
            flexDirection: 'column',
        }}>
            <PrettyFormControl>
                <TextField
                    id="asana-project"
                    label="Asana project"
                    variant="outlined"
                    required={true}
                    placeholder={asanaUrlWithTaskId}
                    onChange={(e) => setTemplateTask(e.target.value)}
                    style={{width: '100%', marginBottom: '10px'}}
                />

                <TextField
                    id="masstasks-file"
                    label="Mass Tasks File"
                    variant="outlined"
                    required={true}
                    type="file"
                    InputLabelProps={{shrink: true}}
                    style={{width: '100%', marginBottom: '10px'}}
                    onChange={(e) => setUploadedFile((e.target as HTMLInputElement).files?.[0] || null)}
                />

                <Button
                    variant="contained"
                    type="submit"
                    onClick={async () => {
                        const response = await createTasksByTemplate(asanaToolsUrl, {
                            asana_template_url: templateTask,
                            uploaded_file: uploadedFile,
                        })

                        // eslint-disable-next-line no-prototype-builtins
                        if (response.hasOwnProperty('error')) {
                            setApiAlertProps({
                                severity: 'error',
                                message: (response as MassTasksErrorResponse).error.message,
                            });
                        } else {
                            setApiAlertProps({
                                severity: 'success',
                                message: 'Success',
                            });
                            setApiResponse(response as MassTasksSuccessResponse);
                        }

                        setTimeout(() => setApiAlertProps(null), 5000)
                    }}
                >
                    Submit
                </Button>
            </PrettyFormControl>

            {
                apiAlertProps && <ApiAlert
                    severity={apiAlertProps.severity}
                    message={apiAlertProps.message}
                />
            }

            {
                apiResponse && <MassTasksResponse
                    created_tasks={apiResponse.created_tasks}
                    failed_tasks={apiResponse.failed_tasks}
                />
            }

        </div>
    )
}

export default MassTasksForm;