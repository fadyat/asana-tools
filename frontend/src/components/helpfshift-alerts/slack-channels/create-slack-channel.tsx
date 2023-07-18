import {Button, FormControl, TextField, Typography} from "@mui/material";
import React, {useState} from "react";
import {
    areErrorsPresent,
    getErrors,
    helpshiftCreateSlackChannelColumns, notifyAboutErrors
} from "../../../templates/helpshift-alerts/columns";
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
    const [validation, setValidation] = useState<validationStatus>({
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
                                error={validation[field.name!] !== ''}
                                helperText={validation[field.name!]}
                                value={channel[field.name as keyof CreateSlackChannelDto]}
                                onChange={(e) => {
                                    const {value, err} = field.validate(e.target.value);

                                    setValidation({
                                        ...validation, [field.name!]: '',
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
                        const errors = getErrors<CreateSlackChannelDto>(helpshiftCreateSlackChannelColumns, channel);
                        if (notifyAboutErrors(errors, validation, setValidation, setApiAlertProps)) {
                            return;
                        }

                        hsClient.slackChannels.new(selectedProject, channel).then((v) => {
                            if (v.ok) {
                                setApiAlertProps({
                                    severity: 'success',
                                    message: 'Ok, refresh the page, please',
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