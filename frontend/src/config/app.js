import Header from "../components/header";
import AppRoutes from "./routes";
import React, {useEffect, useState} from "react";
import "../styles/App.css";
import {UserContext} from "../components/context";

function App() {
    const [user, setUser] = useState(null);

    return (
        <>
            <UserContext.Provider value={{user, setUser}}>
                <Header/>
                <AppRoutes/>
            </UserContext.Provider>
        </>
    );
}

export default App;
