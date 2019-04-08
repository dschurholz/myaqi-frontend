// index.js

import { FETCH_SITES, SITE_SELECTED, RECEIVED_SITES } from '../types';
import axios from 'axios';

export const fetchSites = (sites) => {
  return {
    type: FETCH_SITES,
    sites
  }
};

export const receivedSites = (sites) => {
  return {
    type: RECEIVED_SITES,
    sitesReceivedAt: Date.now(),
    sites
  }
};

export const getSites = () => {
  return (dispatch) => {
    dispatch(fetchSites([]));
    // return axios.get(process.env.REACT_APP_SITES_URL, {params: {extended: true}})
    return axios.get(process.env.REACT_APP_LIVE_SITES_URL)
    // return axios.get('data/sites_test_data.json')
      .then(response => {
        dispatch(receivedSites(response.data.results))
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
