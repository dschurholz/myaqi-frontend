// index.js

import { FETCH_SITES, SITE_SELECTED, FETCH_MEASUREMENTS } from './types';
import axios from 'axios';


export const fetchMeasurementsByQuery = (query) => {
  return (dispatch) => {
    return axios.get(process.env.REACT_APP_MEASUREMENTS_PROXY_URL, {params: query})
      .then(response => {
        dispatch(fetchMeasurements(response.data.Measurements))
      })
      .catch(error => {
        throw(error);
      });
  };
};


export const fetchMeasurements = (measurements) => {
  return {
    type: FETCH_MEASUREMENTS,
    measurements
  }
};

export const fetchSites = (sites) => {
  return {
    type: FETCH_SITES,
    sites
  }
};

export const fetchAllSites = () => {
  return (dispatch) => {
    return axios.get(process.env.REACT_APP_SITES_URL, {params: {extended: true}})
      .then(response => {
        dispatch(fetchSites(response.data.results))
        if (response.data.count > 0) {
          dispatch(siteSelected(response.data.results[0]))          
        }
      })
      .catch(error => {
        throw(error);
      });
  };
};

export const siteSelected = (selectedSite) => {
  return {
    type: SITE_SELECTED,
    selectedSite
  }
};
