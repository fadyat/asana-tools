import {Button, CircularProgress, FormControl, TextField} from "@mui/material";
import "../../styles/Forms.css"
import "../../styles/Responses.css"
import React from "react";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DatePicker} from "@mui/x-date-pickers";
import displayAlert from "../asana/Alerts";
import ActivityDescription from "../description/activity";

export default function Activity() {
    const callBackendAPI = async (request_body) => {
        console.log(request_body)

        const apiEndpoint = process.env.REACT_APP_BACKEND_URI + "tasks/activity";
        setIsReloading(true)
        await new Promise(r => setTimeout(r, 1000));

        if (request_body.completed_before === "") {
            throw new Error("Please select a lower bound!")
        }

        if (request_body.completed_since === "") {
            throw new Error("Please select an upper bound!")
        }

        if (request_body.project === "") {
            throw new Error("Please select a project!")
        }

        const response = await fetch(apiEndpoint, {
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify(request_body),
            headers: {'Content-Type': 'application/json'},
        });

        const response_body = await response.json();
        setIsReloading(false)
        if (response.status >= 400) {
            if (response.status === 401) {
                throw new Error("You are not logged in. Please login and try again.");
            }

            if (response.status === 422) {
                throw new Error("Is all the data correct?");
            }

            throw new Error(response_body.error.message);
        }

        return response_body
    }

    const [params, setParams] = React.useState({
        project: "https://app.asana.com/0/1202951998943680/list",
        completed_since: "2023-01-18",
        completed_before: "2023-01-31",
    })
    const handleChange = (event) => {
        setParams((prevState) => ({
            ...prevState,
            [event.target.name]: event.target.value
        }));
    }
    const [isReloading, setIsReloading] = React.useState(false);
    const alerting = (content) => {
        console.log("alerting")
        setAlertContent(content)
        setTimeout(() => {
            setAlertContent(null)
        }, 10000)
    }
    const [backendResponse, setResponse] = React.useState(null);
    const [alertContent, setAlertContent] = React.useState(null);
    const [alertSeverity, setAlertSeverity] = React.useState("success");

    // noinspection JSValidateTypes
    return (
        <div className="form-object">
            <FormControl className="form-object-formcontrol">
                <div className="form-object-field">
                    <TextField
                        id="project"
                        label="Activity project"
                        variant="outlined"
                        required={true}
                        name="project"
                        value={params.project}
                        onChange={handleChange}
                        placeholder="https://app.asana.com/0/1"
                    />
                </div>
                <div className="form-object-field">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="From"
                            onChange={(date) => {
                                // noinspection JSCheckFunctionSignatures
                                setParams((prevState) => ({
                                    ...prevState,
                                    completed_since: date
                                }));
                            }}
                            value={params.completed_since}
                            name="completed_since"
                            renderInput={(p) => <TextField {...p} />}
                            inputFormat={"DD.MM.YYYY"}
                            className="form-object-field"
                        />
                    </LocalizationProvider>
                </div>
                <div className="form-object-field">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="To"
                            onChange={(date) => {
                                // noinspection JSCheckFunctionSignatures
                                setParams((prevState) => ({
                                    ...prevState,
                                    completed_before: date
                                }));
                            }}
                            value={params.completed_before}
                            name="completed_before"
                            renderInput={(p) => <TextField {...p} />}
                            inputFormat={"DD.MM.YYYY"}
                        />
                    </LocalizationProvider>
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
                            type="submit"
                            onClick={() => {
                                callBackendAPI(params).then((r) => {
                                    alerting("Success")
                                    setAlertSeverity("success")
                                    setResponse(r)
                                    console.log(r)
                                }).catch((err) => {
                                    alerting(err.message)
                                    setAlertSeverity("error")
                                    setIsReloading(false)
                                    console.log(err)
                                })
                            }}
                            className="form-object-field"
                        >
                            Submit
                        </Button>
                    </div>
                )}
                {alertContent ? displayAlert(alertContent, alertSeverity) : <></>}
                {backendResponse ? (
                    <div className="form-object-field">
                        <div className="response-object-field">
                            Tasks found: {backendResponse.length}
                        </div>
                        <div className="response-object-field">
                            {backendResponse.result.map(i => {
                                return <div key={i.user_email}
                                            className="response-object-field-value-item"
                                >
                                    {i.user_email}: {i.actions_cnt}
                                </div>
                            })}
                        </div>
                    </div>
                ) : <></>}
            </FormControl>
            <ActivityDescription/>
        </div>
    )
}