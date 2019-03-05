// SiteMap.js

import { connect } from 'react-redux';
import GoogleMap from '../GoogleMap';
import { siteSelected } from '../../actions';

import { utils } from '../../utils';


const mapStateToProps = state => {
  let icon = 'data:image/svg+xml;utf-8,' + utils.svgIcons.getFireIcon("markers--AQI--Gauge--light");

  return {
    markers: state.sites.sites.map(site => {
      site.iconUrl = icon;
      return site;
    }),
    paths: [],
    polygons: [],
    apiKey: process.env.REACT_APP_GOOGLE_API_KEY, 
    keyField: 'site_id',
    extraMapStyles: {
        'borderBottomLeftRadius': '4px',
        'borderBottomRightRadius': '4px'
    },
    isFetchingData: state.sites.isFetchingSites
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onMarkerSelected: selectedSite => {
      dispatch(siteSelected(selectedSite));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GoogleMap);
