// siteReducer.js

import { SITE_SELECTED } from '../actions/types';

export default function selectedSiteReducer(state=null, action) {
  switch (action.type) {
    case SITE_SELECTED:
      return action.selectedSite;
    default:
      return state;
  }
}