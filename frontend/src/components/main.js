import ContractorReport from "./routes/contractor-report";
import MassTasks from "./routes/mass-tasks";
import {Navigate, Route, Routes} from "react-router-dom";
import Home from "./routes/home";
import Cookies from "js-cookie";

const Main = () => {
    const user = Cookies.get('user');
    return (
        <Routes>
            <Route path="/"
                   element={<Home/>}
            ></Route>
            <Route path="/contractor"
                   element={user ? <ContractorReport/> : <Navigate to="/"/>}
            ></Route>
            <Route path="/mass_tasks"
                   element={user ? <MassTasks/> : <Navigate to="/"/>}
            ></Route>

        </Routes>
    );
}

export default Main;