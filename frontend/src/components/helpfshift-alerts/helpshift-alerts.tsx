import PageDescription from "../core/page-description";
import React, {FC, memo, useState} from "react";
import HelpshiftProjectSelector from "./project-selector";
import ProjectLimitsEditor from "./limits/project-alerts-editor";
import HelpshiftPageSelector from "./page-selector";
import {Box, FormControlLabel, FormGroup, Switch} from "@mui/material";
import HelpshiftPageCreator from "./page-creator";
import ApiAlert, {ApiAlertProps} from "../core/api-alert";
import {SlackChannelsPage, SlackChannelsPages, switchOnSlackPage} from "./slack-channels/page";
import {
    HELPSHIFT_PROJECT_ID_KEY,
    HELPSHIFT_SELECTED_PAGE_KEY,
    HELPSHIFT_SELECTED_SLACK_PAGE_KEY
} from "../../storage/keys";
import {DAY, getWithTTL, setWithTTL} from "../../storage/ttl-based";

export enum HelpshiftAlertsPages {
    LIMITS = 'limits',
    SLACK_CHANNELS = 'slack_channels',
}


const HelpshiftAlerts: FC = memo(() => {
    const [selectedPage, setSelectedPage] = useState<HelpshiftAlertsPages>(
        getWithTTL<HelpshiftAlertsPages>(HELPSHIFT_SELECTED_PAGE_KEY) || HelpshiftAlertsPages.LIMITS,
    );
    const [selectedSlackPage, setSelectedSlackPage] = useState<SlackChannelsPages>(
        getWithTTL<SlackChannelsPages>(HELPSHIFT_SELECTED_SLACK_PAGE_KEY) || SlackChannelsPages.ANOTHER_PAGE,
    );
    const [projectId, setProjectId] = useState<number>(
        getWithTTL<number>(HELPSHIFT_PROJECT_ID_KEY) || 0
    );
    const [apiAlertProps, setApiAlertProps] = useState<ApiAlertProps | null>(null);

    return (
        <div style={{margin: '20px'}}>
            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}>
                <HelpshiftProjectSelector
                    projectId={projectId}
                    setProjectId={setProjectId}
                />

                <HelpshiftPageCreator
                    selectedPage={selectedPage}
                    selectedProject={projectId}
                    setApiAlertProps={setApiAlertProps}
                    selectedSlackPage={selectedSlackPage}
                />

                {
                    selectedSlackPage !== SlackChannelsPages.ANOTHER_PAGE && (
                        <FormGroup>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={selectedSlackPage === SlackChannelsPages.PROJECT_SLACK_CHANNELS}
                                        onChange={() => {
                                            const page = switchOnSlackPage(selectedSlackPage);
                                            setSelectedSlackPage(page);
                                            setWithTTL(HELPSHIFT_SELECTED_SLACK_PAGE_KEY, page, DAY)
                                        }}
                                    />
                                }
                                label={selectedSlackPage}
                            />
                        </FormGroup>
                    )
                }

                <HelpshiftPageSelector
                    selectedPage={selectedPage}
                    setSelectedPage={setSelectedPage}
                    extraSet={(newPage: HelpshiftAlertsPages) => {
                        let newSlackPage;
                        if (newPage === HelpshiftAlertsPages.SLACK_CHANNELS) {
                            setSelectedSlackPage(SlackChannelsPages.PROJECT_SLACK_CHANNELS);
                            newSlackPage = SlackChannelsPages.PROJECT_SLACK_CHANNELS;
                        }

                        if (newPage !== HelpshiftAlertsPages.SLACK_CHANNELS) {
                            setSelectedSlackPage(SlackChannelsPages.ANOTHER_PAGE);
                            newSlackPage = SlackChannelsPages.ANOTHER_PAGE;
                        }

                        setWithTTL(HELPSHIFT_SELECTED_PAGE_KEY, newPage, DAY)
                        setWithTTL(HELPSHIFT_SELECTED_SLACK_PAGE_KEY, newSlackPage, DAY)
                    }}
                />
            </Box>


            {/* todo: make with single block */}

            {
                selectedPage && selectedPage === HelpshiftAlertsPages.LIMITS && (
                    <ProjectLimitsEditor
                        setApiAlertProps={setApiAlertProps}
                        selectedProject={projectId}
                        sx={{height: '68vh', marginTop: '15px'}}
                    />
                )
            }

            {
                selectedPage && selectedPage === HelpshiftAlertsPages.SLACK_CHANNELS && (
                    <SlackChannelsPage
                        selectedProject={projectId}
                        selectedSlackPage={selectedSlackPage}
                        sx={{height: '68vh', marginTop: '15px'}}
                        setApiAlertProps={setApiAlertProps}
                    />
                )
            }

            {
                apiAlertProps && <ApiAlert
                    severity={apiAlertProps.severity}
                    message={apiAlertProps.message}
                />
            }

            <PageDescription
                title="Helpshift alerts configurator"
                points={[
                    "Project alerts configurator"
                ]}
            />
        </div>
    );
});

export default HelpshiftAlerts;