import React, {useState} from "react";
import {Box, Dialog, Fab} from "@mui/material";
import {HelpshiftAlertsPages} from "./helpshift-alerts";
import {Add, Close} from "@mui/icons-material";
import {CreateProjectLimitForm} from "./limits/create-project-limit";
import {ApiAlertProps} from "../core/api-alert";


export type HelpshiftPageCreatorProps = {
    selectedPage: HelpshiftAlertsPages;
    selectedProject: number;
    setApiAlertProps: (v: ApiAlertProps | null) => void,
}


const HelpshiftPageCreator = ({selectedPage, selectedProject, setApiAlertProps}: HelpshiftPageCreatorProps) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Box>
            <Fab color="primary"
                 aria-label="add"
                 onClick={() => setIsOpen(!isOpen)}
                 disabled={!selectedPage}
            >
                <Add/>
            </Fab>
            <Dialog open={isOpen}
                    onClose={() => setIsOpen(false)}
            >
                <Fab color="primary"
                     aria-label="add"
                     onClick={() => setIsOpen(!isOpen)}
                     size={"small"}
                     style={{position: "absolute", top: 0, right: 0, margin: 5}}
                >
                    <Close/>
                </Fab>

                {
                    selectedPage && selectedPage === HelpshiftAlertsPages.LIMITS && (
                        <CreateProjectLimitForm
                            selectedProject={selectedProject}
                            setApiAlertProps={setApiAlertProps}
                            setIsOpen={setIsOpen}
                        />
                    )
                }

                {
                    selectedPage && selectedPage === HelpshiftAlertsPages.SUBSCRIBERS && (
                        <div>
                            Subscribers create page a not done yet
                        </div>
                    )
                }

                {
                    selectedPage && selectedPage === HelpshiftAlertsPages.SLACK_CHANNELS && (
                        <div>
                            Slack Channels create page a not done yet
                        </div>
                    )
                }

            </Dialog>
        </Box>
    )
};


export default HelpshiftPageCreator;