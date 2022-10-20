import React, {useContext} from "react";
import "../../styles/HomePage.css"
import {UserContext} from "../context";
import {useUser} from "../../utils/hooks";

function HelloPage() {
    const {user} = useContext(UserContext);

    return (
        <div className="isLogged">
            <div>
                <h1>Hello, {user}</h1>
                <img src="/hello.webp" alt="hello" style={{
                    width: "40%",
                }}/>
            </div>
        </div>
    )
}

function LoginPage() {
    return (
        <div className="isLogged">
            <div>
                <h1>Not logged in</h1>
                <img src="/login.webp" alt="login" style={{
                    width: "40%",
                }}/>
            </div>
        </div>
    )
}


export {LoginPage, HelloPage}