// index.js

import { combineReducers } from 'redux';
import sites from './siteReducer';
import selectedSite from './selectedSiteReducer';
import selectedFire from './selectedFireReducer';
import measurements from './measurementReducer';
import traffic from './trafficReducer';
import fires from './fireReducer';

export default combineReducers({
    sites: sites,
    selectedSite: selectedSite,
    measurements: measurements,
    traffic: traffic,
    fires: fires,
    selectedFire: selectedFire
});
