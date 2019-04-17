// auth.js

import * as jwt_decode from 'jwt-decode';

export function authHeader() {
    // return authorization header with jwt token
    let token = getAuthToken();

    if (token) {
        return { 'Authorization': 'JWT ' + token };
    } else {
        return {};
    }
}

export function getUser() {
    return JSON.parse(localStorage.getItem('user'));
}

export function setUser(user) {
    return localStorage.setItem('user', JSON.stringify(user));
}

export function removeUser() {
    return localStorage.removeItem('user');
}

export function getAuthToken() {
    return JSON.parse(localStorage.getItem('auth-token'));
}

export function getAuthTokenExpiration() {
    const token = getAuthToken();
    return token ? jwt_decode(token).exp : null;
}

export function setAuthToken(token) {
    return localStorage.setItem('auth-token', JSON.stringify(token));
}

export function removeAuthToken() {
    return localStorage.removeItem('auth-token');
}