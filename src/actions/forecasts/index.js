// index.js

import {
  FETCH_AQI_FORECASTS,
  RECEIVED_AQI_FORECASTS,
  EXPERIMENTS_MAP_REQUEST,
  EXPERIMENTS_MAP_SUCCESS,
  EXPERIMENTS_MAP_FAILURE,
  EXPERIMENTS_DATE_SELECTED } from '../types';
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

export const getExperimentsMapData = (query) => {
  return (dispatch) => {
    dispatch(request([]));

    const { useTestData } = SettingsService.getSettings();
    var url, params = {};
    if (!useTestData) {
      // url = process.env.REACT_APP_EXPERIMENTS_MAP_DATA_URL;
      url = 'data/historic_overall_data_2017_2018.json';
      params = query;
    } else {
      url = 'data/historic_overall_data_2017_2018.json';
    }

    return axios.get(url, { params: params })
      .then(response => {
        dispatch(success(response.data))
      })
      .catch(error => {
        dispatch(failure(error));
        throw(error);
      });
  };

  function request(experimentsData) { return { type: EXPERIMENTS_MAP_REQUEST, experimentsData } }
  function success(experimentsData) { return { type: EXPERIMENTS_MAP_SUCCESS, experimentsReceivedAt: Date.now(), experimentsData } }
  function failure(error) { return { type: EXPERIMENTS_MAP_FAILURE, error } }
};

export const experimentsDateSelected = (selectedDate) => {
  return {
    type: EXPERIMENTS_DATE_SELECTED,
    selectedDate
  }
};
