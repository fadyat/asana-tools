import {Button, FormControl, TextField} from "@mui/material";
import React from "react";
import "../../styles/Forms.css"

const callBackendAPI = async (formData) => {
    const apiEndpoint = process.env.REACT_APP_BACKEND_URI + "tasks/by_template";

    const data = new FormData();
    for (const pair of formData) {
        data.append(pair[0], pair[1]);
    }

    const response = await fetch(apiEndpoint, {
        method: 'POST',
        credentials: 'include',
        body: data
    });
    const body = await response.json();

    if (response.status !== 200) {
        throw Error(body.message)
    }

    return body;
}


export default function MassTasks() {
    const [props, setProps] = React.useState({
        asana_template_url: "",
        uploaded_file: null,
    });

    const handleChange = (event) => {
        setProps((prevState) => ({
            ...prevState,
            [event.target.name]: event.target.value
        }));
    }


    return (
        <div className="form-object">
            <FormControl class="form-object-formcontrol">
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
                            setProps((prevState) => ({
                                ...prevState,
                                uploaded_file: event.target.files[0]
                            }));
                        }}
                    />
                </div>
                <div className="form-object-field">
                    <Button
                        variant="contained"
                        onClick={() => {
                            callBackendAPI([
                                ["asana_template_url", props.asana_template_url],
                                ["uploaded_file", props.uploaded_file]
                            ]).then(
                                res => console.log(res) // TODO: add alert
                            ).catch(
                                err => console.log(err) // TODO: add alert
                            );
                        }}
                    >
                        Submit
                    </Button>
                </div>
            </FormControl>
        </div>
    )
}