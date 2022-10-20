import ContractorReport from "../components/routes/contractor-report";
import MassTasks from "../components/routes/mass-tasks";
import {Navigate, Route, Routes} from "react-router-dom";
import {HelloPage, LoginPage} from "../components/routes/home";
import {useContext} from "react";
import {UserContext} from "../components/context";
import {createBrowserHistory} from "history";
import {useUser} from "../utils/hooks";


export const history = createBrowserHistory();


const AppRoutes = () => {
    const {user} = useContext(UserContext)

    // todo: split hello page and login page
    // doing more /me requests is not good
    useUser();

    return (
        <Routes history={history}>
            <Route path="/" element={user ? <HelloPage/> : <LoginPage/>}/>
            <Route path="/contractor"
                   element={user ? <ContractorReport/> : <Navigate to="/"/>}
            />
            <Route path="/mass_tasks"
                   element={user ? <MassTasks/> : <Navigate to="/"/>}
            />
            <Route path="*"
                   element={<Navigate to="/"/>}
            />
        </Routes>
    );
}

export default AppRoutes;