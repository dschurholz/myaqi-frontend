// auth.js

import * as jwt_decode from 'jwt-decode';
import { sessionStore } from "../services";

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
    let user = JSON.parse(sessionStore.getItem('user'));
    if (user && !user.profile) {
        user.profile = {};
    }
    return user;
}

export function setUser(user) {
    return sessionStore.setItem('user', JSON.stringify(user));
}

export function removeUser() {
    return sessionStore.removeItem('user');
}

export function getAuthToken() {
    return JSON.parse(sessionStore.getItem('auth-token'));
}

export function getAuthTokenExpiration() {
    const token = getAuthToken();
    return token ? jwt_decode(token).exp : null;
}

export function setAuthToken(token) {
    return sessionStore.setItem('auth-token', JSON.stringify(token));
}

export function removeAuthToken() {
    return sessionStore.removeItem('auth-token');
}