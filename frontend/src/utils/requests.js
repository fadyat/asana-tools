import {history} from "../config/routes";


const fetchConfig = method => (endpoint, options) => ({
    method,
    headers: {'Content-Type': 'application/json'},
    credentials: 'include',
    ...options,
});

const handleUnauthorized = (response) => {
    if (response.status === 401) {
        history.push('/')
    }
    return response
}


const get = async (endpoint, options) => await fetch(
    process.env.REACT_APP_BACKEND_URI + endpoint,
    fetchConfig('GET')(options)
).then(handleUnauthorized).then(response => response.json());


const post = async (endpoint, options) => await fetch(
    process.env.REACT_APP_BACKEND_URI + endpoint,
    fetchConfig('POST')(options)
).then(handleUnauthorized).then(response => response.json());


export {get, post};