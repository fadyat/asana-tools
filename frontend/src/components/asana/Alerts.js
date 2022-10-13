import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';
import {Alert} from "@mui/material";


function displayAlert(message, severity) {
    return (
        <Snackbar open={true} autoHideDuration={6000}>
            <Alert severity={severity} sx={{width: '100%'}}>
                {message}
            </Alert>
        </Snackbar>
    );
}

export default displayAlert;