// experimentsMapReducer.js

import { EXPERIMENTS_MAP_REQUEST, EXPERIMENTS_MAP_SUCCESS } from '../actions/types';

export default function experimentsMapData(state = {
      isFetchingExperimentsMapData: false,
      experimentsData: {
        fires:[], sites:[], timeline:[], traffic_stations: []
      } 
    }, action) {

  switch (action.type) {
    case EXPERIMENTS_MAP_REQUEST:
      return {
        ...state,
        isFetchingExperimentsMapData: true
      };
    case EXPERIMENTS_MAP_SUCCESS:
      return {
        ...state,
        isFetchingExperimentsMapData: false,
        experimentsData: action.experimentsData
      };
    default:
      return state;
  }
}