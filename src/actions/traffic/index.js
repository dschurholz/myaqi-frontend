// index.js

import {
  FETCH_VICROADS_TRAFFIC,
  RECEIVED_VICROADS_TRAFFIC,
  FETCH_BING_TRAFFIC,
  RECEIVED_BING_TRAFFIC
} from '../types';
import axios from 'axios';
import { SettingsService } from '../../services';

// Melbourne Metropolitan Area
const DEFAULT_MAP_AREA = '-38.694680,141.010624,-36.008093,147.832930';

export const fetchVicRoadsTraffic = (traffic) => {
  return {
    type: FETCH_VICROADS_TRAFFIC,
    traffic
  }
};

export const receivedVicRoadsTraffic = (traffic) => {
  return {
    type: RECEIVED_VICROADS_TRAFFIC,
    trafficReceivedAt: Date.now(),
    traffic
  }
};

export const getVicRoadsTraffic = () => {
  return (dispatch) => {
    dispatch(fetchVicRoadsTraffic({}));
    const { useTestData } = SettingsService.getSettings();
    var url;
    if (!useTestData) {
      url = process.env.REACT_APP_AU_VIC_ROADS_LIVE;
    } else {
      url = 'data/vicroads_traffic_test_data.json';
    }
    // HISTORIC
    // return axios.get(process.env.REACT_APP_SITES_URL, {params: {extended: true}})
    // return axios.get('data/traffic_test_data.json')
    // LIVE
    return axios.get(url)
      .then(response => {
        dispatch(receivedVicRoadsTraffic(response.data))
      })
      .catch(error => {
        throw(error);
      });
  };
};

export const fetchBingTraffic = (traffic) => {
  return {
    type: FETCH_BING_TRAFFIC,
    traffic
  }
};

export const receivedBingTraffic = (traffic) => {
  return {
    type: RECEIVED_BING_TRAFFIC,
    trafficReceivedAt: Date.now(),
    traffic
  }
};

export const getBingTraffic = (mapArea=DEFAULT_MAP_AREA, types=[], severityLevels=[]) => {
  return (dispatch) => {
    dispatch(fetchBingTraffic({}));

    const { useTestData } = SettingsService.getSettings();
    var url, params = {};
    if (!useTestData) {
      url = process.env.REACT_APP_BING_TRAFFIC_INCIDENTS + mapArea;
      params = {
        key: process.env.REACT_APP_BING_API_KEY
      };
      if (types.length > 0) {
        params.types = types;
      }
      if (severityLevels.length > 0) {
        params.severity = severityLevels;
      }
    } else {
      url = 'data/bing_traffic_test_data.json';
    }

    return axios.get(url, { params: params })
      .then(response => {
        dispatch(receivedBingTraffic(response.data))
      })
      .catch(error => {
        throw(error);
      });
  };
};

