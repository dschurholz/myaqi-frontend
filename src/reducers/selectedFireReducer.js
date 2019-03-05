// fireReducer.js

import { FIRE_SELECTED } from '../actions/types';

export default function selectedFireReducer(state=null, action) {
  switch (action.type) {
    case FIRE_SELECTED:
      return action.selectedFire;
    default:
      return state;
  }
}