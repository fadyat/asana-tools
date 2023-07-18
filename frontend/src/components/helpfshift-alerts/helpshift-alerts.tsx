import PageDescription from "../core/page-description";
import React, {FC, memo, useState} from "react";
import HelpshiftProjectSelector from "./project-selector";
import ProjectLimitsEditor from "./limits/project-alerts-editor";
import HelpshiftPageSelector from "./page-selector";
import {Box} from "@mui/material";
import ProjectSlackChannelsEditor from "./slack-channels/project-slack-channels-editor";
import HelpshiftPageCreator from "./page-creator";
import ApiAlert, {ApiAlertProps} from "../core/api-alert";

export enum HelpshiftAlertsPages {
    LIMITS = 'limits',
    SLACK_CHANNELS = 'slack_channels',
}


const HelpshiftAlerts: FC = memo(() => {
    const [selectedPage, setSelectedPage] = useState<HelpshiftAlertsPages>(HelpshiftAlertsPages.LIMITS);
    const [projectId, setProjectId] = useState<number>(0);
    const [apiAlertProps, setApiAlertProps] = useState<ApiAlertProps | null>(null);

    return (
        <div style={{margin: '20px'}}>
            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
            }}>
                <HelpshiftProjectSelector
                    projectId={projectId}
                    setProjectId={setProjectId}
                />

                <HelpshiftPageCreator
                    selectedPage={selectedPage}
                    selectedProject={projectId}
                    setApiAlertProps={setApiAlertProps}
                />

                <HelpshiftPageSelector
                    selectedPage={selectedPage}
                    setSelectedPage={setSelectedPage}
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
                    <ProjectSlackChannelsEditor
                        selectedProject={projectId}
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
                title="Helshift alerts configurator"
                points={[
                    "Project alerts configurator"
                ]}
            />
        </div>
    );
});

export default HelpshiftAlerts;