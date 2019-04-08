// index.js

import { FETCH_FIRES, RECEIVED_FIRES, FIRE_SELECTED } from '../types';
import axios from 'axios';
import { SettingsService } from '../../services';

export const getAllFires = (query={}) => {
  return (dispatch) => {
    dispatch(fetchFires({}));

    const { useTestData } = SettingsService.getSettings();
    var url, params = {};
    if (!useTestData) {
      url = process.env.REACT_APP_AU_VIC_EMERGENCY_URL;
      params = query;
    } else {
      url = 'data/fire_test_data.json';
    }

    return axios.get(url, { params: params })
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
