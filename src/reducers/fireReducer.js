// fireReducer.js

import { FETCH_FIRES, RECEIVED_FIRES, FETCH_HISTORIC_FIRES, RECEIVED_HISTORIC_FIRES } from '../actions/types';

export const fireReducer =  function(state = { isFetchingFires: true, fires: {} }, action) {
  switch (action.type) {
    case FETCH_FIRES:
      return {
        ...state,
        isFetchingFires: true
      };
    case RECEIVED_FIRES:
      return {
        ...state,
        isFetchingFires: false,
        fires: action.fires
      };
    default:
      return state;
  }
}

export const historicFireReducer = function(state = { isFetchingHistoricFires: true, fires: {} }, action) {
  switch (action.type) {
    case FETCH_HISTORIC_FIRES:
      return {
        ...state,
        isFetchingHistoricFires: true
      };
    case RECEIVED_HISTORIC_FIRES:
      return {
        ...state,
        isFetchingHistoricFires: false,
        fires: action.fires
      };
    default:
      return state;
  }
}