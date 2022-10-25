import {Alert, Button, CircularProgress, FormControl, TextField} from "@mui/material";
import React from "react";
import "../../styles/Forms.css"
import "../../styles/Responses.css"
import displayAlert from "../asana/Alerts";


export default function MassTasks() {
    const callBackendAPI = async (formData) => {
        const apiEndpoint = process.env.REACT_APP_BACKEND_URI + "tasks/by_template";

        const data = new FormData();
        for (const pair of formData) {
            data.append(pair[0], pair[1]);
        }

        setIsReloading(true)
        setBackendResponse(null);
        await new Promise(r => setTimeout(r, 1000));
        const response = await fetch(apiEndpoint, {
            method: 'POST', credentials: 'include', body: data
        });

        setIsReloading(false)
        const response_body = await response.json();
        if (response.status >= 400) {
            throw new Error(response_body.error.message);
        }

        return response_body;
    }

    const alerting = (content) => {
        setAlertContent(content)
        setTimeout(() => {
            setAlertContent(null)
        }, 10000)
    }


    const [alertContent, setAlertContent] = React.useState(null);
    const [alertSeverity, setAlertSeverity] = React.useState("success");
    const [isReloading, setIsReloading] = React.useState(false);
    const [backendResponse, setBackendResponse] = React.useState(null);

    const [props, setProps] = React.useState({
        asana_template_url: "", uploaded_file: null,
    });

    const handleChange = (event) => {
        setProps((prevState) => ({
            ...prevState, [event.target.name]: event.target.value
        }));
    }


    return (
        <div className="form-object">
            <FormControl className="form-object-formcontrol">
                <div className="form-object-field">
                    <TextField
                        id="task_template"
                        name="asana_template_url"
                        label="Task template"
                        variant="outlined"
                        value={props.asana_template_url}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-object-field">
                    <TextField
                        id="mass-tasks-file"
                        label="Mass Tasks File"
                        type="file"
                        name="uploaded_file"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        onChange={(event) => {
                            // noinspection JSCheckFunctionSignatures
                            setProps((prevState) => ({
                                ...prevState,
                                uploaded_file: event.target.files[0]
                            }));
                        }}
                    />
                </div>
                {isReloading ? (
                    <div className="form-object-field" style={{
                        alignItems: "center",
                    }}>
                        <CircularProgress
                            color="secondary"
                            size={30}
                        />
                    </div>
                ) : (
                    <div className="form-object-field">
                        <Button
                            variant="contained"
                            onClick={() => {
                                callBackendAPI([
                                    ["asana_template_url", props.asana_template_url],
                                    ["uploaded_file", props.uploaded_file]
                                ]).then((r) => {
                                    setBackendResponse(r)
                                }).catch((err) => {
                                    alerting(err.message)
                                    setAlertSeverity("error")
                                })
                            }}
                        >
                            Submit
                        </Button>
                    </div>
                )}
                {alertContent ? displayAlert(alertContent, alertSeverity) : <></>}
                {backendResponse ? (
                    <div className="form-object-field">
                        {
                            backendResponse.created_tasks.length > 0 ? (
                                <div className="form-object-field">
                                    <Alert severity="success"
                                           variant="outlined"
                                    >
                                        Created tasks: {backendResponse.created_tasks.length}
                                    </Alert>
                                    <div className="response-object-field">
                                        <div className="response-object-field-value">
                                            {backendResponse.created_tasks.map((task) => (
                                                <div className="response-object-field-value-item">
                                                    <a href={task.permalink_url} target="_blank">{task.name}</a>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ) : <></>

                        }
                        {
                            backendResponse.failed_tasks.length > 0 ? (
                                <div className="form-object-field">
                                    <Alert severity="error"
                                           variant="outlined"
                                    >
                                        Failed tasks: {backendResponse.failed_tasks.length}
                                    </Alert>
                                    <div className="response-object-field">
                                        <div className="response-object-field-value">
                                            {backendResponse.failed_tasks.map(task_response => (
                                                <div className="response-object-field-value-item">
                                                    {task_response.task.name} - {task_response.task.assignee} - {task_response.error}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ) : <></>
                        }
                    </div>
                ) : (<></>)}
            </FormControl>
        </div>
    );
}