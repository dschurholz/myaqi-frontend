// index.js

import { FETCH_TRAFFIC, RECEIVED_TRAFFIC } from '../types';
import axios from 'axios';

export const fetchTraffic = (traffic) => {
  return {
    type: FETCH_TRAFFIC,
    traffic
  }
};

export const receivedTraffic = (traffic) => {
  return {
    type: RECEIVED_TRAFFIC,
    trafficReceivedAt: Date.now(),
    traffic
  }
};

export const getAllTraffic = () => {
  return (dispatch) => {
    dispatch(fetchTraffic({}));
    // return axios.get(process.env.REACT_APP_SITES_URL, {params: {extended: true}})
    return axios.get('data/traffic_test_data.json')
      .then(response => {
        dispatch(receivedTraffic(response.data))
      })
      .catch(error => {
        throw(error);
      });
  };
};
