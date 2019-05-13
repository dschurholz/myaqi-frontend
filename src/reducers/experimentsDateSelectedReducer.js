// experimentsDateSelectedReducer.js

import { EXPERIMENTS_DATE_SELECTED } from '../actions/types';

export default function selectedDateReducer(state=null, action) {
  switch (action.type) {
    case EXPERIMENTS_DATE_SELECTED:
      return action.selectedDate;
    default:
      return state;
  }
}