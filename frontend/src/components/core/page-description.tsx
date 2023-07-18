import React, {useState} from "react";
import {Box, Dialog, DialogContentText, Fab, List, ListItem, Typography} from "@mui/material";
import {Close, QuestionMark} from "@mui/icons-material";
import "./page-description.css"

export type PageDescriptionProps = {
    title: string;
    points: string[];
}


const ActualPageDescription = ({title, points}: PageDescriptionProps) => {
    return (
        <Box className="page-description-content">
            <Typography component={'span'}
                        variant={'h5'}
            >
                {title}
            </Typography>
            <List>
                {
                    points.map((point, index) => (
                        <ListItem key={index}
                                  className="page-description-point"
                        >
                            {point}
                        </ListItem>
                    ))
                }
            </List>
        </Box>
    )
}

const PageDescription = ({title, points}: PageDescriptionProps) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Box className="page-description">
            <Fab color="primary"
                 aria-label="add"
                 onClick={() => setIsOpen(!isOpen)}
            >
                <QuestionMark/>
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

                <ActualPageDescription
                    title={title}
                    points={points}
                />
            </Dialog>
        </Box>
    )
}

export default PageDescription;