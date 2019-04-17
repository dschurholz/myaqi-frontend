import * as types from '../types';
import { UserService } from '../../services';
import { utils } from '../../utils';

export default {
    login,
    logout,
    register,
    getMe,
    updateProfile,
    delete: _delete,
    getQuestionnaire
};

function login(username, password) {
    return dispatch => {
        dispatch(request({ username }));

        UserService.login(username, password)
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
    UserService.logout();
    return { type: types.LOGOUT };
}

function register(user) {
    return dispatch => {
        dispatch(request(user));

        UserService.register(user)
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

        UserService.getMe()
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

        UserService.delete()
            .then(
                user => {
                    dispatch(success())
                    utils.history.push('/login');
                },
                error => dispatch(failure(error.toString()))
            );
    };

    function request() { return { type: types.DELETE_REQUEST,  } }
    function success() { return { type: types.DELETE_SUCCESS,  } }
    function failure(error) { return { type: types.DELETE_FAILURE, error } }
}

function updateProfile(user) {
    return dispatch => {
        dispatch(request({ user }));

        UserService.update(user)
            .then(
                updatedUser => { 
                    dispatch(success(updatedUser));
                },
                error => {
                    dispatch(failure(error.toString()));
                }
            );
    };

    function request(user) { return { type: types.UPDATE_PROFILE_REQUEST, user } }
    function success(user) { return { type: types.UPDATE_PROFILE_SUCCESS, user } }
    function failure(error) { return { type: types.UPDATE_PROFILE_FAILURE, error } }
}

function getQuestionnaire() {
    return dispatch => {
        dispatch(request());

        UserService.getQuestionnaire()
            .then(
                updatedUser => { 
                    dispatch(success(updatedUser));
                },
                error => {
                    dispatch(failure(error.toString()));
                }
            );
    };

    function request() { return { type: types.GET_QUESTIONNAIRE_REQUEST } }
    function success(questionnaire) { return { type: types.GET_QUESTIONNAIRE_SUCCESS, questionnaire } }
    function failure(error) { return { type: types.GET_QUESTIONNAIRE_FAILURE, error } }
}
