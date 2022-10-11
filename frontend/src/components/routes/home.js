import React from "react";
import "../../styles/HomePage.css"
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";

export default function Home() {
    const isLogged = Cookies.get('user') ?
        (
            <div>
                <h1>
                    Hello, {jwt_decode(Cookies.get('user')).name}
                </h1>
                <img src="/hello.png" alt="hello"/>
            </div>
        ) : (
            <div>
                <h1>Not logged in</h1>
                <img src="/login.png" alt="login"/>
            </div>
        );
    return <div className={"isLogged"}>
        {isLogged}
    </div>
}