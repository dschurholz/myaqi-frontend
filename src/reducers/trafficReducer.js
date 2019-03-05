// trafficReducer.js

import { FETCH_TRAFFIC, RECEIVED_TRAFFIC } from '../actions/types';

export default function trafficReducer(state = { isFetchingTraffic: true, traffic: {} }, action) {
  switch (action.type) {
    case FETCH_TRAFFIC:
      return {
        ...state,
        isFetchingTraffic: true
      };
    case RECEIVED_TRAFFIC:
      return {
        ...state,
        isFetchingTraffic: false,
        traffic: action.traffic
      };
    default:
      return state;
  }
}