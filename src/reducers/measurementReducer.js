// measurementReducer.js

import { FETCH_MEASUREMENTS, RECEIVED_MEASUREMENTS } from '../actions/types';

export default function measurementReducer(state = { isFetchingMeasurements: false, measurements: [] }, action) {
  switch (action.type) {
    case FETCH_MEASUREMENTS:
      return {
          ...state,
          isFetchingMeasurements: true,
          measurements: []
      };
    case RECEIVED_MEASUREMENTS:
      return {
          ...state,
          isFetchingMeasurements: false,
          measurements: action.measurements
      };
    default:
      return state;
  }
}
