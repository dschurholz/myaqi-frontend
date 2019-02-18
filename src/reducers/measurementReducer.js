// measurementReducer.js

import { FETCH_MEASUREMENTS } from '../actions/types';

export default function measurementReducer(state = [], action) {
  switch (action.type) {
    // case ADD_POST:
    //   return [...state, action.payload];
    case FETCH_MEASUREMENTS:
      return action.measurements;
    default:
      return state;
  }
}