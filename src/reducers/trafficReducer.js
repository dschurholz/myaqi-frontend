// trafficReducer.js

import {
  FETCH_VICROADS_TRAFFIC,
  RECEIVED_VICROADS_TRAFFIC,
  FETCH_BING_TRAFFIC,
  RECEIVED_BING_TRAFFIC
} from '../actions/types';

export default function trafficReducer(state = { isFetchingTraffic: true, vicRoadsTraffic: {}, bingTraffic: {} }, action) {
  switch (action.type) {
    case FETCH_VICROADS_TRAFFIC:
      return {
        ...state,
        isFetchingTraffic: true
      };
    case RECEIVED_VICROADS_TRAFFIC:
      return {
        ...state,
        isFetchingTraffic: false,
        vicRoadsTraffic: action.traffic
      };
    case FETCH_BING_TRAFFIC:
      return {
        ...state,
        isFetchingTraffic: true
      };
    case RECEIVED_BING_TRAFFIC:
      return {
        ...state,
        isFetchingTraffic: false,
        bingTraffic: action.traffic
      };
    default:
      return state;
  }
}