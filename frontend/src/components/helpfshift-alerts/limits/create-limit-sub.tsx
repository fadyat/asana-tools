import {Button, FormControl, TextField, Typography} from "@mui/material";
import React, {useState} from "react";
import {helpshiftCreateSubscriberColumns} from "../../../templates/helpshift-alerts/columns";
import {createSubscriber, CreateSubscriber} from "../../../api/helpshift/subscriber";
import {helpshiftAlertsUrl, helpshiftApiKey} from "../../../templates/consts";
import {ApiAlertProps} from "../../core/api-alert";


export type CreateProjectSubFormProps = {
    setIsOpen: (v: boolean) => void;
    limitId: number;
    setApiAlertProps: (v: ApiAlertProps | null) => void,
}

const parseBool = (v: string | boolean): boolean => {
    if (typeof v === 'boolean') {
        return v;
    }

    v = v.toLowerCase();
    return v === 'true' || v === '1' || v === 'yes' || v === 'y' || v === 'on' || v === 't';
}

// todo: make it pretty
const toCreateSubscriber = (formState: any) => {

    return {
        name: formState.name,
        phone: formState.phone,
        sms: parseBool(formState.sms),
        calls: parseBool(formState.calls),
    }
}

export const CreateLimitSub = ({setIsOpen, limitId, setApiAlertProps}: CreateProjectSubFormProps) => {

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
                        const dto = toCreateSubscriber(formState);
                        const response = createSubscriber(helpshiftAlertsUrl, helpshiftApiKey, limitId, dto);

                        response.then((v) => {
                            if (v.ok) {
                                setApiAlertProps({
                                    severity: 'success',
                                    message: 'Ok, refresh page please, not implemented yet',
                                })

                                // todo: update subscriber without page refresh -> \
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