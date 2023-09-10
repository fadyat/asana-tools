import React, {useState} from "react";
import {FormControlLabel, FormGroup, Switch} from "@mui/material";
import {EditableSlackChannelsTable} from "./editable-slack-channels-table";
import {hsClient} from "../../../api/helpshift/client";
import {Theme} from "@mui/material/styles";
import {ApiAlertProps} from "../../core/api-alert";
import {SxProps} from "@mui/system";

export enum SlackChannelsPages {
    LIMITS_SLACK_CHANNELS = 'limits_slack_channels',
    PROJECT_SLACK_CHANNELS = 'project_slack_channels',
}

export type ProjectSlackChannelsEditorProps = {
    setApiAlertProps: (v: ApiAlertProps | null) => void,
    selectedProject: number,
    sx?: SxProps<Theme>,
}

function switchOnPage(cur: SlackChannelsPages): SlackChannelsPages {
    if (cur === SlackChannelsPages.LIMITS_SLACK_CHANNELS) {
        return SlackChannelsPages.PROJECT_SLACK_CHANNELS;
    }

    return SlackChannelsPages.LIMITS_SLACK_CHANNELS;
}

function renderComponent(
    page: SlackChannelsPages,
    props: ProjectSlackChannelsEditorProps
) {
    if (page === SlackChannelsPages.PROJECT_SLACK_CHANNELS) {
        return (
            <EditableSlackChannelsTable
                fetchFn={() => hsClient.slackChannels.getAllByProjectID(props.selectedProject)}
                sx={props.sx}
                saveFn={(row) => hsClient.slackChannels.updateForProject(props.selectedProject, row)}
                deleteFn={(row) => hsClient.slackChannels.deleteForProject(props.selectedProject, row.id)}
                setApiAlertProps={props.setApiAlertProps}
            />
        )
    }

    return (
        <EditableSlackChannelsTable
            fetchFn={() => hsClient.slackChannels.getAll()}
            sx={props.sx}
            saveFn={(row) => hsClient.slackChannels.updateForLimits(row)}
            deleteFn={(row) => hsClient.slackChannels.deleteForLimits(row.id)}
            setApiAlertProps={props.setApiAlertProps}
        />
    )
}

// SlackChannelsPage is used as a proxy for
// fast switching between pages:
// - all Slack channels
// - all Slack channels related to current project
export function SlackChannelsPage(byProjectProps: ProjectSlackChannelsEditorProps) {

    // by default showing all channels related to current project
    // made because it used more often, than all channels
    const [page, setPage] = useState<SlackChannelsPages>(SlackChannelsPages.PROJECT_SLACK_CHANNELS);

    return (
        <>
            <FormGroup>
                <FormControlLabel
                    control={
                        <Switch
                            checked={page === SlackChannelsPages.PROJECT_SLACK_CHANNELS}
                            onChange={() => setPage(switchOnPage(page))}
                        />
                    }
                    label={page}
                />
            </FormGroup>

            {renderComponent(page, byProjectProps)}
        </>
    )
}