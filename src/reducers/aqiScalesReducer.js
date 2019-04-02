// aqiscaleReducer.js

import { FETCH_AQI_SCALES, RECEIVED_AQI_SCALES } from '../actions/types';

export default function aqiScaleReducer(state = { isFetchingAqiScales: true, aqiScales: [] }, action) {
  switch (action.type) {
    case FETCH_AQI_SCALES:
      return {
          ...state,
          isFetchingAqiScales: true
      };
    case RECEIVED_AQI_SCALES:
      return {
          ...state,
          isFetchingAqiScales: false,
          aqiScales: action.aqiScales
      };
    default:
      return state;
  }
}