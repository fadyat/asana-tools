import {get} from "./requests";
import {useContext} from "react";
import {UserContext} from "../components/context";

export const useUser = () => {
    const {user, setUser} = useContext(UserContext);
    if (!user) {
        get("me").then((response) => {
            setUser(response.name)
        })
    }
}