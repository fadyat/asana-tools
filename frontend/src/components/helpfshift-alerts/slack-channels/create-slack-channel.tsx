import {Button, FormControl, TextField, Typography} from "@mui/material";
import React, {useState} from "react";
import {helpshiftCreateSlackChannelColumns} from "../../../templates/helpshift-alerts/columns";
import {ApiAlertProps} from "../../core/api-alert";
import {CreateSlackChannel} from "../../../api/helpshift/slack";


export type CreateSlackChannelFormProps = {
    selectedProject: number;
    setApiAlertProps: (v: ApiAlertProps | null) => void;
    setIsOpen: (v: boolean) => void;
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
                        console.log('formState', formState)
                        setIsOpen(false)
                    }}
                >
                    Create
                </Button>
            </FormControl>
        </>
    );
}