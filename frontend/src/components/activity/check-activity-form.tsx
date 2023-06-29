import {Button, TextField} from "@mui/material";
import {asanaUrlWithProjectId} from "../../templates/placeholders";
import React, {useState} from "react";
import PrettyFormControl from "../core/formcontrol";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, {Dayjs} from 'dayjs';
import ApiAlert, {ApiAlertProps} from "../core/api-alert";
import {ActivityErrorResponse, ActivitySuccessResponse, checkUserActivity} from "../../api/asana/activity";
import ActivityResponse from "./activity-response";
import {asanaToolsUrl} from "../../templates/consts";


const CheckActivityForm = () => {
    const [asanaProject, setAsanaProject] = useState<string>('');
    const [completedSince, setCompletedSince] = useState<Dayjs>(dayjs);
    const [completedBefore, setCompletedBefore] = useState<Dayjs>(dayjs);
    const [apiAlertProps, setApiAlertProps] = useState<ApiAlertProps | null>(null);
    const [apiResponse, setApiResponse] = useState<ActivitySuccessResponse | null>(null);

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
                    placeholder={asanaUrlWithProjectId}
                    onChange={(e) => setAsanaProject(e.target.value)}
                    style={{width: '100%', marginBottom: '10px'}}
                />

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        label="From"
                        value={completedSince}
                        onChange={(v: any) => setCompletedSince(v)}
                        format="DD-MM-YYYY"
                        sx={{width: '100%', marginBottom: '10px'}}
                    />
                </LocalizationProvider>

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        label="To"
                        value={completedBefore}
                        onChange={(v: any) => setCompletedBefore(v)}
                        format="DD-MM-YYYY"
                        sx={{width: '100%', marginBottom: '10px'}}
                    />
                </LocalizationProvider>

                <Button
                    variant="contained"
                    type="submit"
                    onClick={async () => {
                        const response = await checkUserActivity(asanaToolsUrl, {
                            completed_since: completedSince?.format('YYYY-MM-DD'),
                            completed_before: completedBefore?.format('YYYY-MM-DD'),
                            project: asanaProject,
                        })

                        // eslint-disable-next-line no-prototype-builtins
                        if (response.hasOwnProperty('error')) {
                            setApiAlertProps({
                                severity: 'error',
                                message: (response as ActivityErrorResponse).error.message,
                            });
                        } else {
                            setApiAlertProps({
                                severity: 'success',
                                message: 'Success',
                            });

                            setApiResponse(response as ActivitySuccessResponse);
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
                apiResponse && <ActivityResponse
                    length={apiResponse.length}
                    result={apiResponse.result}
                />
            }
        </div>
    )
}

export default CheckActivityForm;