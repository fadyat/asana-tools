import {Button} from "@mui/material";
import React, {useCallback, useContext} from "react";
import {UserContext} from "../context";
import {history} from "../../config/routes";

function LogoutButton() {
    const {setUser} = useContext(UserContext);

    const handleLogout = useCallback(async () => {
        const apiEndpoint = process.env.REACT_APP_BACKEND_URI + "logout"
        const response = await fetch(apiEndpoint, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        const body = await response.json();
        if (response.status !== 200) {
            throw Error(body.message)
        }

        setUser(null)
        history.push('/')
    }, [setUser])

    return (
        <Button variant="contained"
                onClick={handleLogout}
        >
            Logout
        </Button>
    );
}

function LoginButton() {

    const openAsanaLoginPage = useCallback(async () => {
        let asanaOauth2Endpoint = process.env.REACT_APP_ASANA_AUTHORIZATION_URI || "https://app.asana.com/-/oauth_authorize";
        const queryParams = new URLSearchParams({
            client_id: process.env.REACT_APP_ASANA_CLIENT_ID,
            redirect_uri: process.env.REACT_APP_BACKEND_URI_REDIRECT_ENDPOINT,
            response_type: "code",
        })

        window.location = `${asanaOauth2Endpoint}?${queryParams.toString()}`
    }, [])

    return (
        <Button variant="contained"
                onClick={openAsanaLoginPage}
        >
            Login
        </Button>
    );
}

export {LogoutButton, LoginButton};
