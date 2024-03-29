import React from "react";
import {AlertColor, Snackbar, Alert} from "@mui/material";

export type ApiAlertProps = {
    severity: AlertColor
    message: string
}

const ApiAlert = ({severity, message}: ApiAlertProps) => {
    return (
        <Snackbar open={true} autoHideDuration={6000}>
            <Alert severity={severity} sx={{width: '100%'}}>
                {message}
            </Alert>
        </Snackbar>
    )
}

export default ApiAlert;