import {Button, FormControl, TextField} from "@mui/material";
import React from "react";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DatePicker} from "@mui/x-date-pickers";
import "../../styles/Forms.css"

const callBackendAPI = async (request_body) => {
    const apiEndpoint = process.env.REACT_APP_BACKEND_URI + "tasks/contractor/report";

    const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(request_body),
    });
    const body = await response.json();

    if (response.status !== 200) {
        throw Error(body.message)
    }

    return body;
}

// const displayAlert = (err) => {
//     return (
//         <Snackbar
//             open={true}
//             autoHideDuration={6000}
//         >
//             <Alert
//                 severity="success"
//                 sx={{width: '100%'}}
//             >
//                 err.message
//             </Alert>
//         </Snackbar>
//     );
// }

export default function ContractorReport() {

    const [params, setParams] = React.useState({
        contractor_email: "",
        report_project: "",
        contractor_project: "",
        completed_since: new Date(),
        completed_before: new Date(),
    });


    const handleChange = (event) => {
        setParams((prevState) => ({
            ...prevState,
            [event.target.name]: event.target.value
        }));
    }

    return (
        <div className="form-object">
            <FormControl className="form-object-formcontrol">
                <div className="form-object-field">
                    <TextField
                        id="contractor_project"
                        label="Contractor project"
                        variant="outlined"
                        required={true}
                        name="contractor_project"
                        value={params.contractor_project}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-object-field">
                    <TextField
                        id="contractor_email"
                        label="Contractor email"
                        variant="outlined"
                        required={false}
                        name="contractor_email"
                        value={params.contractor_email}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-object-field">
                    <TextField
                        id="report_project"
                        label="Report project"
                        variant="outlined"
                        required={true}
                        name="report_project"
                        value={params.report_project}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-object-field">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Completed since"
                            onChange={(date) => {
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
                            label="Completed before"
                            onChange={(date) => {
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
                <div className="form-object-field">
                    <Button
                        variant="contained"
                        type="submit"
                        onClick={
                            () => {
                                callBackendAPI(params).then((res) => {
                                        console.log(res); // TODO: do the alert here
                                    }
                                ).catch(err => { // TODO: do the alert here
                                    console.log(err);
                                })
                            }
                        }
                        className="form-object-field"
                    >Submit
                    </Button>
                </div>
            </FormControl>
        </div>
    )
        ;
}