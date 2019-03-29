import * as types from '../types';
import { UserService } from '../../services';
import { utils } from '../../utils';
// import { alertActions } from './';

export const userActions = {
    login,
    logout,
    register,
    getMe,
    delete: _delete
};

function login(username, password) {
    return dispatch => {
        dispatch(request({ username }));

        UserService.userService.login(username, password)
            .then(
                user => { 
                    dispatch(success(user));
                    dispatch(getMe(() => {
                        utils.history.push('/');
                    }));
                },
                error => {
                    dispatch(failure(error.toString()));
                    // dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request(user) { return { type: types.LOGIN_REQUEST, user } }
    function success(user) { return { type: types.LOGIN_SUCCESS, user } }
    function failure(error) { return { type: types.LOGIN_FAILURE, error } }
}

function logout() {
    UserService.userService.logout();
    return { type: types.LOGOUT };
}

function register(user) {
    return dispatch => {
        dispatch(request(user));

        UserService.userService.register(user)
            .then(
                user => { 
                    dispatch(success());
                    utils.history.push('/login');
                    // dispatch(alertActions.success('Registration successful'));
                },
                error => {
                    dispatch(failure(error.toString()));
                    // dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request(user) { return { type: types.REGISTER_REQUEST, user } }
    function success(user) { return { type: types.REGISTER_SUCCESS, user } }
    function failure(error) { return { type: types.REGISTER_FAILURE, error } }
}

function getMe(callback) {
    return dispatch => {
        dispatch(request());

        UserService.userService.getMe()
            .then(
                user => {
                    dispatch(success(user));
                    if (callback && typeof callback === 'function') {
                        callback();
                    }
                },
                error => dispatch(failure(error.toString()))
            );
    };

    function request() { return { type: types.GETME_REQUEST } }
    function success(user) { return { type: types.GETME_SUCCESS, user } }
    function failure(error) { return { type: types.GETME_FAILURE, error } }
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete() {
    return dispatch => {
        dispatch(request());

        UserService.userService.delete()
            .then(
                user => dispatch(success()),
                error => dispatch(failure(error.toString()))
            );
    };

    function request() { return { type: types.DELETE_REQUEST,  } }
    function success() { return { type: types.DELETE_SUCCESS,  } }
    function failure(error) { return { type: types.DELETE_FAILURE, error } }
}
