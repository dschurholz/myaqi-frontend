import { utils } from '../utils';
import axios from 'axios';

export default {
    login,
    logout,
    register,
    getMe,
    update,
    delete: _delete,
    getQuestionnaire,
    checkTokenExpired
};

function login(username, password) {
    const requestOptions = {
        headers: { 'Content-Type': 'application/json' },
        body: { username: username, password: password }
    };

    return axios.post(`${process.env.REACT_APP_API_ROOT}auth/token/`, requestOptions.body, { headers: requestOptions.headers })
        .then(response => {
            const token = handleResponse(response);
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            utils.auth.setAuthToken(token.token);

            return token;
        })
        .catch(handleError);
}

function logout() {
    // remove user from local storage to log user out
    utils.auth.removeUser();
    utils.auth.removeAuthToken();
}

function getMe() {
    const requestOptions = {
        headers: utils.auth.authHeader(),
        withCredentials: true
    };

    return axios.get(`${process.env.REACT_APP_API_ROOT}me`, requestOptions)
        .then(response => {
            const user = handleResponse(response);
            utils.auth.setUser(user);
        })
        .catch(handleError);
}

function checkTokenExpired() {
    const tokenExp = utils.auth.getAuthTokenExpiration(),
          expirationDate = new Date(0),
          now = new Date();
    expirationDate.setUTCSeconds(tokenExp);
    if (expirationDate < now) {
        return true;
    }
    return false;
}

function register(user) {
    const requestOptions = {
        headers: { 'Content-Type': 'application/json' }
    };

    return axios.post(`${process.env.REACT_APP_API_ROOT}accounts/`, user, requestOptions)
        .then(handleResponse)
        .catch(handleError);
}

function update(user) {
    const requestOptions = {
        headers: { ...utils.auth.authHeader(), 'Content-Type': 'application/json' }
    };

    return axios.put(`${process.env.REACT_APP_API_ROOT}me/`, user, requestOptions)
        .then(response => {
            const updatedUser = handleResponse(response);
            utils.auth.setUser(updatedUser);
            return updatedUser;
        })
        .catch(handleError);
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete() {
    const requestOptions = {
        headers: utils.auth.authHeader()
    };

    return axios.delete(`${process.env.REACT_APP_API_ROOT}me/`, requestOptions)
        .then(handleResponse)
        .catch(handleError);
}

function getQuestionnaire() {
    return axios.get(`${process.env.REACT_APP_API_ROOT}questionnaire/`)
        .then(response => {
            // returning questionnaire
            return handleResponse(response);
        })
        .catch(handleError);
}

function handleResponse(response) {
    return response.data;
}

function handleError(error) {
    if (error.response.status === 401) {
        // auto logout if 401 response returned from api
        logout();
        window.location.reload(true);
    } 
    var errorText;
    // if (error.response && error.response.status === 400 && error.response.data && error.response.data['non_field_errors']) {
    //     errorText = error.response.data['non_field_errors'][0];
    // } else {
    //     errorText = error.response.data || error.response.statusText;
    // }
    errorText = error;
    return Promise.reject(errorText);
}