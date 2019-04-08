// ForecastMap.js

import { connect } from 'react-redux';
import GoogleMap from '../GoogleMap';
import { getAqiForecasts } from '../../actions';

import { utils } from '../../utils';


const mapStateToProps = state => {
  const { forecasts } = state.aqiForecasts;
  let icon = (value) => {
    return 'data:image/svg+xml;utf-8,' + utils.svgIcons.getGaugeIcon("light", value);
  };

  return {
    markers: [],
    paths: [],
    polygons: [],
    apiKey: process.env.REACT_APP_GOOGLE_API_KEY, 
    keyField: '',
    extraMapStyles: {
        'borderBottomLeftRadius': '4px',
        'borderBottomRightRadius': '4px'
    },
    isFetchingData: false,
    isInteractive: true,
    defaultIcon: (forecasts.data && forecasts.data.length > 0) ? icon(forecasts.data[0]['aqi']) : icon(0)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onMapClicked: (lat, lon) => {
      dispatch(getAqiForecasts(lat, lon));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GoogleMap);
