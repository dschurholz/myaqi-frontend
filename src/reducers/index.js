// index.js

import { combineReducers } from 'redux';
import sites from './siteReducer';
import selectedSite from './selectedSiteReducer';
import measurements from './measurementReducer';

export default combineReducers({
    sites: sites,
    selectedSite: selectedSite,
    measurements: measurements
});
