import {Button, FormControl, TextField, Typography} from "@mui/material";
import React, {useState} from "react";
import {helpshiftCreateSubscriberColumns} from "../../../templates/helpshift-alerts/columns";
import {CreateSubscriber} from "../../../api/helpshift/subscriber";


export type CreateProjectSubFormProps = {
    // selectedProject: number;
    // setApiAlertProps: (v: ApiAlertProps | null) => void;
    setIsOpen: (v: boolean) => void;
}

export const CreateProjectSub = ({setIsOpen}: CreateProjectSubFormProps) => {

    // todo: make it pretty
    const [formState, setFormState] = useState({
        name: '',
        phone: '',
        sms: true,
        calls: true,
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
                    New Project Subscriber
                </Typography>

                {
                    helpshiftCreateSubscriberColumns.map((field) => {
                        return (
                            <TextField
                                label={field.label}
                                type='text'
                                name={field.name}
                                key={field.name}
                                placeholder={field.placeholder}
                                sx={{margin: '5px'}}
                                value={formState[field.name as keyof CreateSubscriber]}
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