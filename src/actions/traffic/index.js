// index.js

import {
  FETCH_VICROADS_TRAFFIC,
  RECEIVED_VICROADS_TRAFFIC,
  FETCH_BING_TRAFFIC,
  RECEIVED_BING_TRAFFIC
} from '../types';
import axios from 'axios';

// Melbourne Metropolitan Area
const DEFAULT_MAP_AREA = '-37.947051,144.619003,-37.642215,145.212961';

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
    // HISTORIC
    // return axios.get(process.env.REACT_APP_SITES_URL, {params: {extended: true}})
    // return axios.get('data/traffic_test_data.json')
    // LIVE
    return axios.get(process.env.REACT_APP_AU_VIC_ROADS_LIVE)
    // return axios.get('data/vicroads_traffic_test_data.json')
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
    var params = {
      key: process.env.REACT_APP_BING_API_KEY
    };
    if (types.length > 0) {
      params.types = types;
    }
    if (severityLevels.length > 0) {
      params.severity = severityLevels;
    }
    return axios.get(process.env.REACT_APP_BING_TRAFFIC_INCIDENTS + mapArea, {params: params})
    // return axios.get('data/bing_traffic_test_data.json')
      .then(response => {
        dispatch(receivedBingTraffic(response.data))
      })
      .catch(error => {
        throw(error);
      });
  };
};

