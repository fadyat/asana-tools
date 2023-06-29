import {Theme} from "@mui/material/styles";
import {SxProps} from "@mui/system";
import React from "react";
import {Box} from "@mui/material";

export type ProjectSubscribersEditorProps = {
    selectedProject: number,
    sx?: SxProps<Theme>,
}

const LimitSubscribersEditor = ({sx}: ProjectSubscribersEditorProps) => {

    return (
        <Box sx={{width: '100%', ...sx}}
        >
            Subscribers page a not done yet :(
        </Box>
    )
}

export default LimitSubscribersEditor;