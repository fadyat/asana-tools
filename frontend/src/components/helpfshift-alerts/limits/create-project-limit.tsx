import {Button, FormControl, TextField, Typography} from "@mui/material";
import React, {useState} from "react";
import {createProjectLimit, CreateProjectLimit} from "../../../api/helpshift/limit";
import {helpshiftAlertsUrl, helpshiftApiKey} from "../../../templates/consts";
import {helpshiftCreateLimitsColumns} from "../../../templates/helpshift-alerts/columns";
import {ApiAlertProps} from "../../core/api-alert";


export type CreateProjectLimitFormProps = {
    selectedProject: number;
    setApiAlertProps: (v: ApiAlertProps | null) => void;
    setIsOpen: (v: boolean) => void;
}

// todo: make it pretty
const toCreateProjectLimit = (formState: any) => {
    return {
        name: formState.name,
        daysOfWeek: formState.daysOfWeek.split(',').map((day: string) => parseInt(day)),
        timeOfDay: formState.timeOfDay,
        duration: formState.duration,
        pollingInterval: formState.pollingInterval,
        smsLimit: parseInt(formState.smsLimit) || 0,
        callLimit: parseInt(formState.callLimit) || 0,

        isEnabled: formState.isEnabled,
        projectId: formState.projectId,
    }
}

export const CreateProjectLimitForm = ({selectedProject, setApiAlertProps, setIsOpen}: CreateProjectLimitFormProps) => {

    // todo: make it pretty
    const [formState, setFormState] = useState({
        name: '',
        daysOfWeek: '',
        timeOfDay: '',
        duration: '',
        pollingInterval: '',
        smsLimit: 0,
        callLimit: 0,

        isEnabled: true,
        projectId: selectedProject,
    })

    return (
        <>
            <FormControl
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    width: '600px',
                }}
            >
                <Typography
                    sx={{
                        margin: '5px',
                        marginTop: '10px',
                        textDecoration: 'underline',
                        alignSelf: 'center',
                    }}
                    variant={'h5'}
                >
                    New Project Limit
                </Typography>

                {
                    helpshiftCreateLimitsColumns.map((field) => {
                        return (
                            <TextField
                                label={field.label}
                                type='text'
                                name={field.name}
                                key={field.name}
                                placeholder={field.placeholder}
                                sx={{margin: '5px'}}
                                value={formState[field.name as keyof CreateProjectLimit]}
                                onChange={(e) => {
                                    setFormState({
                                        ...formState,
                                        [field.name!]: e.target.value,
                                    })
                                }}
                            />
                        )
                    })
                }

                <Button
                    variant="contained"
                    type="submit"
                    sx={{margin: '5px'}}
                    onClick={() => {
                        const dto = toCreateProjectLimit(formState);
                        const response = createProjectLimit(helpshiftAlertsUrl, helpshiftApiKey, dto)

                        response.then((v) => {
                            if (v.ok) {
                                setApiAlertProps({
                                    severity: 'success',
                                    message: 'Ok, refresh page please, not implemented yet',
                                })

                                // todo: update limits without page refresh
                                setIsOpen(false);
                                return;
                            }

                            setApiAlertProps({
                                severity: 'error',
                                message: `Failed: \n${v.error}`,
                            });
                        })

                        setTimeout(() => setApiAlertProps(null), 5000);
                    }}
                >
                    Create
                </Button>
            </FormControl>
        </>
    );
}