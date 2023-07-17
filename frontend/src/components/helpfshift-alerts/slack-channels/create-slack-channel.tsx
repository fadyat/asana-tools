import {Button, FormControl, TextField, Typography} from "@mui/material";
import React, {useState} from "react";
import {helpshiftCreateSlackChannelColumns} from "../../../templates/helpshift-alerts/columns";
import {ApiAlertProps} from "../../core/api-alert";
import {createSlackChannel, CreateSlackChannel} from "../../../api/helpshift/slack";
import {helpshiftAlertsUrl, helpshiftApiKey} from "../../../templates/consts";


export type CreateSlackChannelFormProps = {
    selectedProject: number;
    setApiAlertProps: (v: ApiAlertProps | null) => void;
    setIsOpen: (v: boolean) => void;
}

// todo: make it pretty
const toCreateSlackChannel = (formState: any) => {
    return {
        name: formState.name,
        type: parseInt(formState.type),
        url: formState.url,
    }
}

export const CreateSlackChannelForm = ({selectedProject, setApiAlertProps, setIsOpen}: CreateSlackChannelFormProps) => {

    // todo: make it pretty
    const [formState, setFormState] = useState({
        name: '',
        type: '',
        url: '',
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
                    New Slack Channel
                </Typography>

                {
                    helpshiftCreateSlackChannelColumns.map((field) => {
                        return (
                            <TextField
                                label={field.label}
                                type='text'
                                name={field.name}
                                key={field.name}
                                placeholder={field.placeholder}
                                sx={{margin: '5px'}}
                                value={formState[field.name as keyof CreateSlackChannel]}
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
                        const dto = toCreateSlackChannel(formState);
                        const response = createSlackChannel(helpshiftAlertsUrl, helpshiftApiKey, selectedProject, dto);

                        response.then((v) => {
                            if (v.ok) {
                                setApiAlertProps({
                                    severity: 'success',
                                    message: 'Ok, refresh page please, not implemented yet',
                                })

                                // todo: update slack channels without page refresh -> \
                                //      return id from backend first
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