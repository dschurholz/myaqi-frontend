// siteReducer.js

import { FETCH_SITES, SITE_SELECTED } from '../actions/types';

export default function siteReducer(state = [], action) {
  switch (action.type) {
    // case ADD_POST:
    //   return [...state, action.payload];
    case FETCH_SITES:
      return action.sites;
    default:
      return state;
  }
}