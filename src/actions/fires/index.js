// index.js

import { FETCH_FIRES, RECEIVED_FIRES, FIRE_SELECTED } from '../types';
import axios from 'axios';


export const getAllFires = (query={}) => {
  return (dispatch) => {
    dispatch(fetchFires({}));
    return axios.get(process.env.REACT_APP_AU_VIC_EMERGENCY_URL, {params: query})
    //return axios.get('data/fire_test_data.json', {params: query})
      .then(response => {
        dispatch(receivedFires(response.data))
      })
      .catch(error => {
        throw(error);
      });
  };
};

export const fetchFires = (fires) => {
  return {
    type: FETCH_FIRES,
    fires
  }
};

export const receivedFires = (fires) => {
  return {
    type: RECEIVED_FIRES,
    firesReceivedAt: Date.now(),
    fires
  }
};

export const fireSelected = (selectedFire) => {
  return {
    type: FIRE_SELECTED,
    selectedFire
  }
};
