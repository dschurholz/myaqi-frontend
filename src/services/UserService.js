import { utils } from '../utils';
import axios from 'axios';

export const userService = {
    login,
    logout,
    register,
    getMe,
    update,
    delete: _delete
};

function login(username, password) {
    const requestOptions = {
        headers: { 'Content-Type': 'application/json' },
        body: { username: username, password: password }
    };

    return axios.post(`${process.env.REACT_APP_API_ROOT}auth/token/`, requestOptions.body, { headers: requestOptions.headers })
        .then(handleResponse)
        .then(token => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            console.log("user-token:", token);
            localStorage.setItem('user-token', JSON.stringify(token));

            return token;
        });
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user-token');
    localStorage.removeItem('user');
}

function getMe() {
    const requestOptions = {
        headers: utils.auth.authHeader()
    };

    return axios.get(`${process.env.REACT_APP_API_ROOT}me`, requestOptions)
        .then(handleResponse)
        .then((user) => {
            console.log("user:", user);
            localStorage.setItem('user', JSON.stringify(user));
        });
}

function register(user) {
    const requestOptions = {
        headers: { 'Content-Type': 'application/json' }
    };

    return axios.post(`${process.env.REACT_APP_API_ROOT}accounts/`, JSON.stringify(user), requestOptions).then(handleResponse);
}

function update(user) {
    const requestOptions = {
        headers: { ...utils.auth.authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    };

    return axios.put(`${process.env.REACT_APP_API_ROOT}me/`, requestOptions).then(handleResponse);
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete() {
    const requestOptions = {
        headers: utils.auth.authHeader()
    };

    return axios.delete(`${process.env.REACT_APP_API_ROOT}me/`, requestOptions).then(handleResponse);
}

function handleResponse(response) {
    if (response.status >= 400) {
        if (response.status === 401) {
            // auto logout if 401 response returned from api
            logout();
            window.location.reload(true);
        }

        const error = (response.data && response.data.message) || response.statusText;
        return Promise.reject(error);
    }

    return response.data;
}