import {BrowserRouter} from "react-router-dom";
import App from "./config/app";
import {createRoot} from "react-dom/client";

const root = createRoot(document.getElementById('root'));

root.render((
    <BrowserRouter>
        <App/>
    </BrowserRouter>
));
