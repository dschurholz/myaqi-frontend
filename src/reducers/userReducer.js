// userReducer.js

import * as types from '../actions/types';
import { utils } from '../utils';

let user = utils.auth.getUser();
const initialState = user ? { loggedIn: true, user } : {};

export function authentication(state = initialState, action) {
  switch (action.type) {
    case types.LOGIN_REQUEST:
      return {
        loggingIn: true,
        user: action.user
      };
    case types.LOGIN_SUCCESS:
      return {
        loggedIn: true,
        user: action.user
      };
    case types.LOGIN_FAILURE:
      return {
        error: action.error
      };
    case types.LOGOUT:
      return {};
    default:
      return state
  }
}

export function registration(state = {}, action) {
  switch (action.type) {
    case types.REGISTER_REQUEST:
      return { registering: true };
    case types.REGISTER_SUCCESS:
      return {};
    case types.REGISTER_FAILURE:
      return {};
    default:
      return state
  }
}

export function currentUser(state = {}, action) {
  switch (action.type) {
    case types.GETME_REQUEST:
      return {
        ...state,
        loading: true
      };
    case types.GETME_SUCCESS:
      return {
        user: action.user
      };
    case types.UPDATE_PROFILE_REQUEST:
      return {
        updating: true,
        ...state
      };
    case types.UPDATE_PROFILE_SUCCESS:
      return {
        user: action.user
      };
    case types.GETME_FAILURE:
    case types.UPDATE_PROFILE_FAILURE:
      return {
        ...state,
        error: action.error
      };
    case types.DELETE_REQUEST:
      // add 'deleting:true' property to user being deleted
      return {
        deleting: true,
        ...state
      };
    case types.DELETE_SUCCESS:
      // remove deleted user from state
      return {};
    case types.DELETE_FAILURE:
      // remove 'deleting:true' property and add 'deleteError:[error]' property to user 
      return {
        error: action.error,
        ...state
      };
    default:
      return state
  }
}

export function questionnaire (state = {isFetchingQuestionnaire: false}, action) {
  switch (action.type) {
    case types.GET_QUESTIONNAIRE_REQUEST:
      return { isFetchingQuestionnaire: true };
    case types.GET_QUESTIONNAIRE_SUCCESS:
      return {
        isFetchingQuestionnaire: false,
        questionnaire: action.questionnaire
      };
    case types.GET_QUESTIONNAIRE_FAILURE:
      return {
        isFetchingQuestionnaire: false,
        error: action.error
      };
    default:
      return state
  }
}