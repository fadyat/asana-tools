// create question mark button, that will display a description of the page

import {Dialog, Fab} from "@mui/material";
import React from "react";
import {Close, QuestionMark} from "@mui/icons-material";
import "../../styles/PageDesription.css"

export default function PageDescription({pageHeader, pagePoints}) {
    const [isDescriptionOpen, setIsDescriptionOpen] = React.useState(false);

    return (
        <div className="page-description">
            <Fab color="primary"
                 aria-label="add"
                 onClick={() => {
                     setIsDescriptionOpen(!isDescriptionOpen)
                 }}
            >
                <QuestionMark/>
            </Fab>
            <Dialog open={isDescriptionOpen}
                    onClose={() => {
                        setIsDescriptionOpen(!isDescriptionOpen)
                    }}
            >
                <Fab color="primary"
                     aria-label="add"
                     onClick={() => {
                         setIsDescriptionOpen(!isDescriptionOpen)
                     }}
                     size={"small"}
                     style={{position: "absolute", top: 0, right: 0, margin: 5}}
                >
                    <Close/>
                </Fab>
                <div className="page-description-content">
                    <h2>{pageHeader}</h2>
                    {pagePoints.map((point) => (
                        <div key={point}
                             className="page-description-point"
                        >{point}</div>
                    ))}
                </div>

            </Dialog>
        </div>
    );
}