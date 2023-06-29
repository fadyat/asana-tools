import React, {useState} from "react";
import {Dialog, Fab, List, ListItem, Typography} from "@mui/material";
import {Close, QuestionMark} from "@mui/icons-material";
import "./page-description.css"

export type PageDescriptionProps = {
    title: string;
    points: string[];
}


const ActualPageDescription = ({title, points}: PageDescriptionProps) => {
    return (
        <Typography className="page-description-content">
            <Typography variant='h5'>{title}</Typography>
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
        </Typography>
    )
}

const PageDescription = ({title, points}: PageDescriptionProps) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="page-description">
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
        </div>
    )
}

export default PageDescription;