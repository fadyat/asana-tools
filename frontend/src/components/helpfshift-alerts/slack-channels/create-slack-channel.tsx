import {Button, FormControl, TextField, Typography} from "@mui/material";
import React, {useState} from "react";
import {helpshiftCreateSlackChannelColumns} from "../../../templates/helpshift-alerts/columns";
import {ApiAlertProps} from "../../core/api-alert";
import {CreateSlackChannelDto} from "../../../api/helpshift/slack";
import {hsClient} from "../../../api/helpshift/client";
import {validationStatus} from "../../../templates/validate";


export type CreateSlackChannelFormProps = {
    selectedProject: number;
    setApiAlertProps: (v: ApiAlertProps | null) => void;
    setIsOpen: (v: boolean) => void;
}

export const CreateSlackChannelForm = ({selectedProject, setApiAlertProps, setIsOpen}: CreateSlackChannelFormProps) => {
    const [channel, setChannel] = useState<CreateSlackChannelDto>({
        name: '', type: 0, url: ''
    })
    const [validationStatus, setValidationStatus] = useState<validationStatus>({
        name: '', type: '', url: ''
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
                                name={field.name}
                                key={field.name}
                                placeholder={field.placeholder}
                                sx={{margin: '5px'}}
                                error={validationStatus[field.name!] !== ''}
                                helperText={validationStatus[field.name!]}
                                value={channel[field.name as keyof CreateSlackChannelDto]}
                                onChange={(e) => {
                                    const {value, err} = field.validate(e.target.value);

                                    setValidationStatus({
                                        ...validationStatus,
                                        [field.name!]: err!,
                                    })

                                    setChannel({
                                        ...channel,
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
                        const errors = helpshiftCreateSlackChannelColumns.map((field) => {
                            const {err} = field.validate(channel[field.name as keyof CreateSlackChannelDto]);
                            return {[field.name!]: err!};
                        })

                        if (errors.some((v) => Object.values(v)[0] !== '')) {
                            setValidationStatus({
                                ...validationStatus,
                                ...errors.reduce((acc, v) => {
                                    return {...acc, ...v}
                                }, {})
                            })

                            setApiAlertProps({
                                severity: 'error',
                                message: 'Please fix errors',
                            })

                            setTimeout(() => setApiAlertProps(null), 5000);
                            return;
                        }

                        hsClient.slackChannels.new(selectedProject, channel).then((v) => {
                            if (v.ok) {
                                setApiAlertProps({
                                    severity: 'success',
                                    message: 'Ok, refresh the page please',
                                })

                                // todo: update slack channel without page refresh
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