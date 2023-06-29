import React from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {IconButton, Link, Menu, MenuItem} from "@mui/material";


export type RouteInfo = {
    redirectUrl: string;
    displayedName: string;
    component?: React.ReactNode;
}

export type RoutesMenuProps = {
    routesInfo: RouteInfo[];
}

const RoutesMenu: React.FC<RoutesMenuProps> = React.memo(
    ({routesInfo}) => {
        const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

        return (
            <>
                <IconButton
                    aria-label="more"
                    id="long-button"
                    aria-haspopup="true"
                    sx={{
                        display: 'flex',
                        justifyContent: 'flex-start'
                    }}
                    onClick={(e) => {
                        setAnchorEl(e.currentTarget)
                    }}
                >
                    <MoreVertIcon style={{color: 'white'}}/>
                </IconButton>

                <Menu open={Boolean(anchorEl)}
                      anchorEl={anchorEl}
                      onClose={() => {
                          setAnchorEl(null)
                      }}
                      id="long-menu"
                >
                    {
                        routesInfo.map(({redirectUrl, displayedName}) => (
                            <MenuItem
                                key={redirectUrl}
                                onClick={() => {
                                    setAnchorEl(null)
                                }}
                                sx={{
                                    width: '100%',
                                    padding: '0'
                                }}
                            >
                                <Link href={redirectUrl}
                                      underline="none"
                                      color="inherit"
                                      sx={{
                                          width: '100%',
                                          padding: '3px 15px',
                                      }}
                                >
                                    {displayedName}
                                </Link>
                            </MenuItem>
                        ))
                    }
                </Menu>
            </>
        );
    }
);

export default RoutesMenu;