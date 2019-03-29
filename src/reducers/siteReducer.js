// siteReducer.js

import { FETCH_SITES, RECEIVED_SITES } from '../actions/types';

export default function siteReducer(state = { isFetchingSites: true, sites: [] }, action) {
  switch (action.type) {
    case FETCH_SITES:
      return {
          ...state,
          isFetchingSites: true
      };
    case RECEIVED_SITES:
      return {
          ...state,
          isFetchingSites: false,
          sites: action.sites
      };
    default:
      return state;
  }
}