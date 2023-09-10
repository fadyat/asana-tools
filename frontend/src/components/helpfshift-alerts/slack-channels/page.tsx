import React from "react";
import {EditableSlackChannelsTable} from "./editable-slack-channels-table";
import {hsClient} from "../../../api/helpshift/client";
import {Theme} from "@mui/material/styles";
import {ApiAlertProps} from "../../core/api-alert";
import {SxProps} from "@mui/system";

export enum SlackChannelsPages {
    LIMITS_SLACK_CHANNELS = 'limits_slack_channels',
    PROJECT_SLACK_CHANNELS = 'project_slack_channels',

    // ANOTHER_PAGE is used for useState component in global page switcher
    ANOTHER_PAGE = 'another_page',
}

export type ProjectSlackChannelsEditorProps = {
    setApiAlertProps: (v: ApiAlertProps | null) => void,
    selectedProject: number,
    selectedSlackPage?: SlackChannelsPages,
    sx?: SxProps<Theme>,
}


// switchOnSlackPage used to get next value for switcher component
export function switchOnSlackPage(cur: SlackChannelsPages): SlackChannelsPages {
    if (cur === SlackChannelsPages.LIMITS_SLACK_CHANNELS) {
        return SlackChannelsPages.PROJECT_SLACK_CHANNELS;
    }

    return SlackChannelsPages.LIMITS_SLACK_CHANNELS;
}

function renderComponent(
    props: ProjectSlackChannelsEditorProps
) {
    if (props.selectedSlackPage === SlackChannelsPages.PROJECT_SLACK_CHANNELS) {
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
    return renderComponent(byProjectProps)
}