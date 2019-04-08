// index.js

import { FETCH_MEASUREMENTS, RECEIVED_MEASUREMENTS } from '../types';
import axios from 'axios';
import { SettingsService } from '../../services';


export const getMeasurementsByQuery = query => {
  return (dispatch) => {
    dispatch(fetchMeasurements(query));

    const { useTestData } = SettingsService.getSettings();
    var url, params = {};
    if (!useTestData) {
      url = process.env.REACT_APP_MEASUREMENTS_PROXY_URL;
      params = query;
    } else {
      url = 'data/measurements_test_data.json';
    }

    return axios.get(url, { params: params })
      .then(response => {
        dispatch(receivedMeasurements(response.data))
      })
      .catch(error => {
        throw(error);
      });
  };
};


export const receivedMeasurements = (measurements) => {
  return {
    type: RECEIVED_MEASUREMENTS,
    measurementsReceivedAt: Date.now(),
    measurements
  }
};

export const fetchMeasurements = (query) => {
  return {
    type: FETCH_MEASUREMENTS,
    query: query
  }
};
