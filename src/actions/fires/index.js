// index.js

import {
  FETCH_FIRES,
  RECEIVED_FIRES,
  FIRES_FAILURE,
  FIRE_SELECTED,
  FETCH_HISTORIC_FIRES,
  RECEIVED_HISTORIC_FIRES,
  HISTORIC_FIRE_SELECTED,
  HISTORIC_FIRES_FAILURE } from '../types';
import { FireService } from '../../services';

export const getAllFires = (query={}) => {
  return (dispatch) => {

    dispatch(request({}));
    FireService.getVicEmergencyFires(query)
      .then(
          fires => {
            dispatch(success(fires))
          },
          error => {
              dispatch(failure(error.toString()));
              // dispatch(alertActions.error(error.toString()));
          }
      );
  };

  function request(fires) { return { type: FETCH_FIRES, fires } }
  function success(fires) { return { type: RECEIVED_FIRES, firesReceivedAt: Date.now(), fires } }
  function failure(error) { return { type: FIRES_FAILURE, error } }
};

export const getHistoricAllFires = (query={}) => {
  return (dispatch) => {
    dispatch(request({}));

    FireService.getHistoricFires(query)
      .then(
          fires => {
            dispatch(success(fires))
          },
          error => {
              dispatch(failure(error.toString()));
              // dispatch(alertActions.error(error.toString()));
          }
      );
  };

  function request(fires) { return { type: FETCH_HISTORIC_FIRES, fires } }
  function success(fires) { return { type: RECEIVED_HISTORIC_FIRES, firesReceivedAt: Date.now(), fires } }
  function failure(error) { return { type: HISTORIC_FIRES_FAILURE, error } }
};

export const fireSelected = (selectedFire) => {
  return {
    type: FIRE_SELECTED,
    selectedFire
  }
};

export const historicFireSelected = (selectedHistoricFire) => {
  return {
    type: HISTORIC_FIRE_SELECTED,
    selectedHistoricFire
  }
};
