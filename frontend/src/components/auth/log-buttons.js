import {Button} from "@mui/material";
import React from "react";


class LogoutButton extends React.Component {

    async logout() {
        const apiEndpoint = process.env.REACT_APP_BACKEND_URI + "logout"
        const response = await fetch(
            apiEndpoint, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
        const body = await response.json();
        if (response.status !== 200) {
            throw Error(body.message)
        }
        window.location = "/"
    }

    render() {
        return (
            <Button variant="contained"
                    onClick={this.logout}
            >
                Logout
            </Button>
        );
    }
}

class LoginButton extends React.Component {

    async callAsanaOauth2() {
        let asanaOauth2Endpoint = process.env.REACT_APP_ASANA_AUTHORIZATION_URI || "https://app.asana.com/-/oauth_authorize";
        const redirectEndpoint = 'callback'

        const queryParams = new URLSearchParams({
            client_id: process.env.REACT_APP_ASANA_CLIENT_ID,
            redirect_uri: process.env.REACT_APP_BACKEND_URI + redirectEndpoint,
            response_type: "code",
        })

        window.location = `${asanaOauth2Endpoint}?${queryParams.toString()}`
    }

    render() {
        return (
            <Button variant="contained"
                    onClick={this.callAsanaOauth2}
            >
                Login
            </Button>
        );
    }
}

export {LogoutButton, LoginButton};
