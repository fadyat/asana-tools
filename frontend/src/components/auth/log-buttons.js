import Cookies from "js-cookie";
import {Button} from "@mui/material";
import React from "react";

class LogoutButton extends React.Component {
    render() {
        return (
            <Button
                variant="contained"
                onClick={() => {
                    Cookies.remove('user');
                    // todo: call the backend and remove token from cookies
                    // todo: block all the requests to the backend
                    window.location = '/';
                }}
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
