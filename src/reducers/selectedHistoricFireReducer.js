// selectedHistoricFireReducer.js

import { HISTORIC_FIRE_SELECTED } from '../actions/types';

export default function selectedHistoricFireReducer(state=null, action) {
  switch (action.type) {
    case HISTORIC_FIRE_SELECTED:
      return action.selectedHistoricFire;
    default:
      return state;
  }
}