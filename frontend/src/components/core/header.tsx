import React from 'react';
import {AppBar, Box, Toolbar, Typography} from "@mui/material";
import RoutesMenu, {RouteInfo} from './routes-menu';
import AsanaAuthFlow from "./auth";
import {appVersion, asanaToolsUrl} from "../../templates/consts";

export type AppHeaderProps = {
    routesInfo: RouteInfo[];
    title: string;
};

const AppHeader: React.FC<AppHeaderProps> = React.memo(
    ({title, routesInfo}) => {

        return (
            <Box>
                <AppBar position="static"
                        sx={{backgroundColor: '#2887fa'}}
                >
                    <Toolbar>
                        <RoutesMenu routesInfo={routesInfo}/>
                        <Typography
                            variant="h6"
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                width: '100%'
                            }}
                        >
                            {title} ({appVersion})
                        </Typography>

                        <AsanaAuthFlow
                            asanaToolsUrl={asanaToolsUrl}
                        />
                    </Toolbar>
                </AppBar>
            </Box>
        );
    }
);

export default AppHeader;