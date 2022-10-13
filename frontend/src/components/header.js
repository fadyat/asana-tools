import React from "react";
import Cookies from "js-cookie";
import {AppBar, Box, Toolbar, Typography} from "@mui/material";
import {LoginButton, LogoutButton} from "./auth/log-buttons";
import AsanaMenu from "./asana/Menu";

const renderLoginOrLogoutButton = () => {
    return Cookies.get('user') ?
        <LogoutButton/> :
        <LoginButton/>
}


export default function Header() {
    return (
        <Box sx={{flexGrow: 1}}>
            <AppBar position="static">
                <Toolbar>
                    <AsanaMenu/>
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{flexGrow: 1}}
                    >
                        Asana scripts
                    </Typography>
                    {renderLoginOrLogoutButton()}
                </Toolbar>
            </AppBar>
        </Box>
    );
}

