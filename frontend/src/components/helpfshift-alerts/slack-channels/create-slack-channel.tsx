import {Button, FormControl, TextField, Typography} from "@mui/material";
import React, {useState} from "react";
import {
    getErrors,
    helpshiftCreateSlackChannelColumns,
    notifyAboutErrors
} from "../../../templates/helpshift-alerts/columns";
import {ApiAlertProps} from "../../core/api-alert";
import {CreatedSlackChannelDto, CreateSlackChannelDto} from "../../../api/helpshift/slack";
import {validationStatus} from "../../../templates/validate";
import {ApiResponse} from "../../../api/client";
import {SlackChannelsPages} from "./page";
import {hsClient} from "../../../api/helpshift/client";


export type CreateSlackChannelFormProps = {
    name?: string,
    setApiAlertProps: (v: ApiAlertProps | null) => void;
    setIsOpen: (v: boolean) => void;
    saveFn?: (channel: CreateSlackChannelDto) => Promise<ApiResponse<CreatedSlackChannelDto>>
}


export const CreateSlackChannelFormByPage = (
    {page, selectedProject, setApiAlertProps, setIsOpen}: {
        page: SlackChannelsPages,
        selectedProject: number,
    } & CreateSlackChannelFormProps
) => {
    switch (page) {
        case SlackChannelsPages.LIMITS_SLACK_CHANNELS:
            return (
                <CreateSlackChannelForm
                    setApiAlertProps={setApiAlertProps}
                    setIsOpen={setIsOpen}
                    saveFn={(c) => hsClient.slackChannels.newForLimits(c)}
                    name={'New Limits Slack Channel'}
                />
            )
        case SlackChannelsPages.PROJECT_SLACK_CHANNELS:
            return (
                <CreateSlackChannelForm
                    setApiAlertProps={setApiAlertProps}
                    setIsOpen={setIsOpen}
                    saveFn={(c) => hsClient.slackChannels.newForProject(selectedProject, c)}
                    name={'New Project Slack Channel'}
                />
            )
    }

    return null;
}

const CreateSlackChannelForm = (
    {name, setApiAlertProps, setIsOpen, saveFn}: CreateSlackChannelFormProps
) => {
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
                    {name}
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

                        saveFn!(channel).then((v) => {
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