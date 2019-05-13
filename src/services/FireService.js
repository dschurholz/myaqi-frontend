import { utils } from '../utils';
import axios from 'axios';

import { SettingsService } from './index';

export default {
    getHistoricFires,
    getVicEmergencyFires
};

function getVicEmergencyFires(query) {
    const { useTestData } = SettingsService.getSettings();
    var url, params = {};
    if (!useTestData) {
      url = process.env.REACT_APP_AU_VIC_EMERGENCY_URL;
      params = query;
    } else {
      url = 'data/fire_test_data_5_3_2019.json';
    }

    return axios.get(url, { params: params })
      .then(response => {
        const fires = handleResponse(response); 
        return fires;
      })
      .catch(error => {
        throw(error);
      });
}

function getHistoricFires(query) {
    const requestOptions = {
        headers: utils.auth.authHeader()
    };

    const { useTestData } = SettingsService.getSettings();
    var url, params = {};
    if (!useTestData) {
      // url = process.env.REACT_APP_AU_HISTORIC_FIRES_URL;
      url = 'data/historic_fires_data_2017_2018.json';
      params = query;
    } else {
      url = 'data/historic_fires_data_for_experiments_2017_2018_radius_0.2.json';
    }

    return axios.get(url, { params: params })
      .then(response => {
        const fires = { results: handleResponse(response) };
        // let fires;
        // if (!useTestData) {
        //   fires = handleResponse(response);
        // } else {
        //   fires = { results: handleResponse(response) };
        // }
        return fires;
      })
      .catch(error => {
        throw(error);
      });
}


function handleResponse(response) {
    return response.data;
}
