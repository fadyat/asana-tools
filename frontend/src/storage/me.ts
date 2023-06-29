import {Me} from "../api/asana/me";

export const putMeLocalStorage = (me: Me | null) => {
    if (!me) {
        clearMeLocalStorage()
        return
    }

    localStorage.setItem('me', JSON.stringify(me))
}

export const getMeLocalStorage = (): Me | null => {
    const me = localStorage.getItem('me')
    return me ? JSON.parse(me) : null
}

export const clearMeLocalStorage = () => {
    localStorage.removeItem('me')
}