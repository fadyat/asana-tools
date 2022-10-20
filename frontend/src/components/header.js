import React, {useContext} from "react";
import {AppBar, Box, Toolbar, Typography} from "@mui/material";
import {LoginButton, LogoutButton} from "./auth/log-buttons";
import AsanaMenu from "./asana/Menu";
import {UserContext} from "./context";


export default function Header() {
    const {user} = useContext(UserContext);

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
                    {user ? <LogoutButton/> : <LoginButton/>}
                </Toolbar>
            </AppBar>
        </Box>
    );
}

