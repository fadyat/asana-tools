import React from 'react';
import AppHeader from "./components/core/header";
import './App.css';
import {RouteInfo} from "./components/core/routes-menu";
import {Navigate, Route, Routes} from "react-router-dom";
import Activity from "./components/activity/activity";
import HelpshiftAlerts from "./components/helpfshift-alerts/helpshift-alerts";
import MassTasks from "./components/mass-tasks/mass-tasks";
import Home from "./components/home/home";

const App = () => {
    const routesInfo: RouteInfo[] = [
        {
            redirectUrl: '/',
            displayedName: 'Home',
            component: <Home/>
        },
        {
            redirectUrl: '/activity',
            displayedName: 'Activity',
            component: <Activity/>
        },
        {
            redirectUrl: '/mass_tasks',
            displayedName: 'Mass tasks',
            component: <MassTasks/>
        },
        {
            redirectUrl: '/helpshift_alerts',
            displayedName: 'Helpshift alerts',
            component: <HelpshiftAlerts/>
        },
    ]

    return (
        <>
            <AppHeader
                title="Playkot services"
                routesInfo={routesInfo}
            />

            <Routes>
                {
                    routesInfo.map(({redirectUrl, component}) => (
                        <Route key={redirectUrl} path={redirectUrl} element={component}/>
                    ))
                }

                <Route path="*" element={<Navigate to="/"/>}/>
            </Routes>
        </>
    );
}

export default App;
