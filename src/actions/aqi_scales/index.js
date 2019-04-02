// index.js

import { FETCH_AQI_SCALES, AQI_SCALE_SELECTED, RECEIVED_AQI_SCALES } from '../types';
import axios from 'axios';

export const fetchScales = (aqiScales) => {
  return {
    type: FETCH_AQI_SCALES,
    aqiScales
  }
};

export const receivedScales = (aqiScales) => {
  return {
    type: RECEIVED_AQI_SCALES,
    aqiScalesReceivedAt: Date.now(),
    aqiScales
  }
};

export const getAQIScales = () => {
  return (dispatch) => {
    dispatch(fetchScales([]));
    return axios.get(process.env.REACT_APP_API_ROOT + 'aqi-scales/')
      .then(response => {
        dispatch(receivedScales(response.data.results))
        if (response.data.count > 0) {
          dispatch(aqiScaleSelected(response.data.results[0]))          
        }
      })
      .catch(error => {
        console.error(error);
      });
  };
};

export const aqiScaleSelected = (aqiScale) => {
  return {
    type: AQI_SCALE_SELECTED,
    aqiScale
  }
};
