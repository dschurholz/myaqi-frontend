// index.js

import { combineReducers } from 'redux';
import sites from './siteReducer';
import selectedSite from './selectedSiteReducer';
import selectedFire from './selectedFireReducer';
import selectedHistoricFire from './selectedHistoricFireReducer';
import selectedExperimentsDate from './experimentsDateSelectedReducer';
import measurements from './measurementReducer';
import traffic from './trafficReducer';
import { fireReducer, historicFireReducer } from './fireReducer';
import aqiForecasts from './aqiForecastsReducer';
import experimentsMapData from './experimentsMapReducer';
import aqiScales from './aqiScalesReducer';
import { authentication, registration, currentUser, questionnaire } from './userReducer';

export default combineReducers({
    sites: sites,
    selectedSite: selectedSite,
    measurements: measurements,
    traffic: traffic,
    fires: fireReducer,
    historicFires: historicFireReducer,
    selectedFire: selectedFire,
    selectedHistoricFire: selectedHistoricFire,
    aqiForecasts: aqiForecasts,
    aqiScales: aqiScales,
    authentication: authentication,
    registration: registration,
    currentUser: currentUser,
    questionnaire: questionnaire,
    experimentsMapData,
    selectedExperimentsDate
});
