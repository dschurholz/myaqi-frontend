// fireReducer.js

import { FETCH_FIRES, RECEIVED_FIRES } from '../actions/types';

export default function fireReducer(state = { isFetchingFires: true, fires: {} }, action) {
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