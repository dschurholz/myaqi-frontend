// index.js

import { FETCH_MEASUREMENTS, RECEIVED_MEASUREMENTS } from '../types';
import axios from 'axios';


export const getMeasurementsByQuery = query => {
  return (dispatch) => {
    dispatch(fetchMeasurements(query));
    return axios.get(process.env.REACT_APP_MEASUREMENTS_PROXY_URL, {params: query})
    // return axios.get('data/measurements_test_data.json')
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
