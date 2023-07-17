import PageDescription from "../core/page-description";
import React, {FC, memo, useState} from "react";
import GameProjectSelector from "./game-project-selector";
import {GameProject} from "../../api/helpshift/project";
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
    const [gameProjects, setGameProjects] = useState<GameProject[]>([]);
    const [selectedPage, setSelectedPage] = useState<HelpshiftAlertsPages>(HelpshiftAlertsPages.LIMITS);
    const [selectedProject, setSelectedProject] = useState<number>(0);
    const [apiAlertProps, setApiAlertProps] = useState<ApiAlertProps | null>(null);

    return (
        <div style={{margin: '20px'}}>
            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
            }}>
                <GameProjectSelector
                    projects={gameProjects}
                    setProjects={setGameProjects}
                    selectedProject={selectedProject}
                    setSelectedProject={setSelectedProject}
                />

                <HelpshiftPageCreator
                    selectedPage={selectedPage}
                    selectedProject={selectedProject}
                    setApiAlertProps={setApiAlertProps}
                />

                <HelpshiftPageSelector
                    selectedPage={selectedPage}
                    setSelectedPage={setSelectedPage}
                />
            </Box>


            {
                selectedPage && selectedPage === HelpshiftAlertsPages.LIMITS && (
                    <ProjectLimitsEditor
                        setApiAlertProps={setApiAlertProps}
                        selectedProject={selectedProject}
                        sx={{height: '68vh', marginTop: '15px'}}
                    />
                )
            }

            {
                selectedPage && selectedPage === HelpshiftAlertsPages.SLACK_CHANNELS && (
                    <ProjectSlackChannelsEditor
                        selectedProject={selectedProject}
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