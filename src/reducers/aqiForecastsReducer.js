// aqiForecastsReducer.js

import { FETCH_AQI_FORECASTS, RECEIVED_AQI_FORECASTS } from '../actions/types';

export default function aqiForecastsReducer(state = { isFetchingAqiForecasts: false, forecasts: {} }, action) {
  switch (action.type) {
    case FETCH_AQI_FORECASTS:
      return {
        ...state,
        isFetchingAqiForecasts: true
      };
    case RECEIVED_AQI_FORECASTS:
      return {
        ...state,
        isFetchingAqiForecasts: false,
        forecasts: action.forecasts
      };
    default:
      return state;
  }
}