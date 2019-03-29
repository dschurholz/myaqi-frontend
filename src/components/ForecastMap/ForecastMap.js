// ForecastMap.js

import { connect } from 'react-redux';
import GoogleMap from '../GoogleMap';
import { getAqiForecasts } from '../../actions';

import { utils } from '../../utils';


const mapStateToProps = state => {
  let icon = 'data:image/svg+xml;utf-8,' + utils.svgIcons.getFireIcon("markers--AQI--Gauge--light");

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
    defaultIcon: icon
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
