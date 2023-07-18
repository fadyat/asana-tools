import {Button, FormControl, TextField, Typography} from "@mui/material";
import React, {useState} from "react";
import {
    getErrors, helpshiftCreateSubscriberColumns, notifyAboutErrors
} from "../../../templates/helpshift-alerts/columns";
import {CreateSubscriberDto} from "../../../api/helpshift/subscriber";
import {ApiAlertProps} from "../../core/api-alert";
import {hsClient} from "../../../api/helpshift/client";
import {validationStatus} from "../../../templates/validate";


export type CreateProjectSubFormProps = {
    setIsOpen: (v: boolean) => void;
    limitId: number;
    setApiAlertProps: (v: ApiAlertProps | null) => void,
}

export const CreateLimitSub = ({setIsOpen, limitId, setApiAlertProps}: CreateProjectSubFormProps) => {
    const [subscriber, setSubscriber] = useState<CreateSubscriberDto>({
        name: '', phone: '', sms: true, calls: true,
    })
    const [validation, setValidation] = useState<validationStatus>({
        name: '', phone: '', sms: '', calls: '',
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
                                error={validation[field.name!] !== ''}
                                helperText={validation[field.name!]}
                                sx={{margin: '5px'}}
                                value={subscriber[field.name as keyof CreateSubscriberDto]}
                                onChange={(e) => {
                                    const {value, err} = field.validate(e.target.value);

                                    setValidation({
                                        ...validation, [field.name!]: '',
                                    })

                                    setSubscriber({
                                        ...subscriber,
                                        [field.name!]: err ? e.target.value : value,
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
                        const errors = getErrors<CreateSubscriberDto>(helpshiftCreateSubscriberColumns, subscriber);
                        if (notifyAboutErrors(errors, validation, setValidation, setApiAlertProps)) {
                            return;
                        }

                        hsClient.subscribers.new(limitId, subscriber).then((v) => {
                            if (v.ok) {
                                setApiAlertProps({
                                    severity: 'success',
                                    message: 'Ok, refresh the page, please',
                                })

                                // todo: update project subscribers without page refresh
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