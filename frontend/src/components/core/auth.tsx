import React, {useEffect, useState} from "react";
import {alpha, Button, styled} from "@mui/material";
import {Me, getMe} from "../../api/asana/me";
import {clearMeLocalStorage, putMeLocalStorage} from "../../storage/me";

const AuthButton = styled(Button)({
    backgroundColor: alpha('#2887fa', 0.3),
    minWidth: '100px',
    color: 'white',
    '&:hover': {
        backgroundColor: '#2887fa',
    },
});


export type AsanaAuthProps = {
    asanaToolsUrl: string,
}

const AsanaAuth = ({asanaToolsUrl}: AsanaAuthProps) => {

    return (
        <AuthButton
            variant="contained"
            href={asanaToolsUrl}
        >
            Login
        </AuthButton>
    )
}


const AsanaLogout = ({asanaToolsUrl}: AsanaAuthProps) => {

    return (
        <AuthButton
            variant="contained"
            onClick={async () => {
                await fetch(asanaToolsUrl, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    credentials: 'include',
                });

                clearMeLocalStorage();
                window.location.reload();
            }}
        >
            Logout
        </AuthButton>
    )
}

const AsanaPending = () => {

    return (
        <AuthButton
            variant="contained"
            sx={{visibility: 'hidden'}}
        />
    )
}

const AsanaAuthFlow = ({asanaToolsUrl}: AsanaAuthProps) => {
    const [me, setMe] = useState<Me | string | null>("pending")

    const getMeComponent = () => {
        if (me === "pending") {
            return <AsanaPending/>
        }

        if (!me) {
            return <AsanaAuth
                asanaToolsUrl={`${asanaToolsUrl}/api/v1/auth`}
            />
        }

        return <AsanaLogout
            asanaToolsUrl={`${asanaToolsUrl}/api/v1/logout`}
        />
    }

    useEffect(() => {
        getMe(asanaToolsUrl).then((me) => {
            putMeLocalStorage(me)
            setMe(me)
        })
    }, []);

    return (
        <>{getMeComponent()}</>
    )
}

export default AsanaAuthFlow;