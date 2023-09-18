import {Button, FormControl, TextField, Typography} from "@mui/material";
import React, {useState} from "react";
import {CreateLimitDto} from "../../../api/helpshift/limit";
import {getErrors, helpshiftCreateLimitsColumns, notifyAboutErrors} from "../../../templates/helpshift-alerts/columns";
import {ApiAlertProps} from "../../core/api-alert";
import {hsClient} from "../../../api/helpshift/client";
import {validationStatus} from "../../../templates/validate";


export type CreateProjectLimitFormProps = {
    selectedProject: number;
    setApiAlertProps: (v: ApiAlertProps | null) => void;
    setIsOpen: (v: boolean) => void;
}

export const CreateProjectLimitForm = ({selectedProject, setApiAlertProps, setIsOpen}: CreateProjectLimitFormProps) => {
    const [limit, setLimit] = useState<CreateLimitDto>({
        name: '', daysOfWeek: [], timeOfDay: '', duration: '', pollingInterval: '',
        smsLimit: 1, callLimit: 1, isEnabled: true,
        // todo: fix this
        slackLimit: 0, slackChannelName: '',
    })
    const [validation, setValidation] = useState<validationStatus>({
        name: '', daysOfWeek: '', timeOfDay: '', duration: '', pollingInterval: '',
        smsLimit: '', callLimit: '', isEnabled: '',
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
                                error={validation[field.name!] !== ''}
                                helperText={validation[field.name!]}
                                placeholder={field.placeholder}
                                sx={{margin: '5px'}}
                                value={limit[field.name as keyof CreateLimitDto]}
                                onChange={(e) => {
                                    const {value, err} = field.validate(e.target.value);

                                    setValidation({
                                        ...validation, [field.name!]: '',
                                    })

                                    setLimit({
                                        ...limit,
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
                        const errors = getErrors<CreateLimitDto>(helpshiftCreateLimitsColumns, limit);
                        if (notifyAboutErrors(errors, validation, setValidation, setApiAlertProps)) {
                            return;
                        }

                        hsClient.limits.new(selectedProject, limit).then((r) => {
                            if (r.ok) {
                                setApiAlertProps({
                                    severity: 'success',
                                    message: 'Ok, refresh the page, please',
                                })

                                // todo: update limits without page refresh
                                setIsOpen(false);
                                return;
                            }

                            setApiAlertProps({
                                severity: 'error',
                                message: `Failed: \n${r.error}`,
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