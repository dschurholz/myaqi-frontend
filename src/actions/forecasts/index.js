// index.js

import { FETCH_AQI_FORECASTS, RECEIVED_AQI_FORECASTS } from '../types';
import axios from 'axios';
import { SettingsService } from '../../services';

export const fetchAqiForecasts = (forecasts) => {
  return {
    type: FETCH_AQI_FORECASTS,
    forecasts
  }
};

export const receivedAqiForecasts = (forecasts) => {
  return {
    type: RECEIVED_AQI_FORECASTS,
    forecastsReceivedAt: Date.now(),
    forecasts
  }
};

export const getAqiForecasts = (lat, lon) => {
  return (dispatch) => {
    dispatch(fetchAqiForecasts([]));

    const { useTestData } = SettingsService.getSettings();
    var url, params = {};
    if (!useTestData) {
      url = process.env.REACT_APP_WEATHERBIT_AQI_FORECAST;
      params = {
        key: process.env.REACT_APP_WEATHERBIT_API_KEY,
        lat: lat,
        lon: lon
      };
    } else {
      url = 'data/aqi_forecast_test_data.json';
    }

    return axios.get(url, { params: params })
      .then(response => {
        dispatch(receivedAqiForecasts(response.data))
      })
      .catch(error => {
        throw(error);
      });
  };
};
