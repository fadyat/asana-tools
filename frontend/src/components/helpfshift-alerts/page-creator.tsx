import React, {useState} from "react";
import {Box, Dialog, Fab} from "@mui/material";
import {HelpshiftAlertsPages} from "./helpshift-alerts";
import {Add, Close} from "@mui/icons-material";
import {CreateProjectLimitForm} from "./limits/create-project-limit";
import {ApiAlertProps} from "../core/api-alert";
import {CreateSlackChannelFormByPage} from "./slack-channels/create-slack-channel";
import {SlackChannelsPages} from "./slack-channels/page";


export type HelpshiftPageCreatorProps = {
    selectedPage: HelpshiftAlertsPages;
    selectedProject: number;
    setApiAlertProps: (v: ApiAlertProps | null) => void,
    selectedSlackPage?: SlackChannelsPages,
}


const HelpshiftPageCreator = (
    {selectedPage, selectedProject, setApiAlertProps, selectedSlackPage}: HelpshiftPageCreatorProps
) => {
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
                    selectedPage && selectedPage === HelpshiftAlertsPages.SLACK_CHANNELS && (
                        <CreateSlackChannelFormByPage
                            page={selectedSlackPage!}
                            selectedProject={selectedProject}
                            setApiAlertProps={setApiAlertProps}
                            setIsOpen={setIsOpen}
                        />
                    )
                }

            </Dialog>
        </Box>
    )
};


export default HelpshiftPageCreator;