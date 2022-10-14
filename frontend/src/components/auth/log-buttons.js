import {Button} from "@mui/material";
import React from "react";

const callBackendAPI = async () => {
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


class LogoutButton extends React.Component {
    render() {
        return (
            <Button
                variant="contained"
                onClick={callBackendAPI}
            >
                Logout
            </Button>
        );
    }
}

class LoginButton extends React.Component {
    render() {
        return (
            <Button
                variant="contained"
                onClick={() => {
                    window.location.href = process.env.REACT_APP_BACKEND_URI + "auth"
                }}
            >
                Login
            </Button>
        );
    }
}

export {LogoutButton, LoginButton};
