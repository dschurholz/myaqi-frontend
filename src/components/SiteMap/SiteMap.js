// SiteMap.js

import { connect } from 'react-redux';
import GoogleMap from '../GoogleMap';
import { siteSelected } from '../../actions';


const mapStateToProps = state => {
  return {
    markers: state.sites,
    apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
    keyField: 'site_id',
    extraMapStyles: {
        'borderBottomLeftRadius': '4px',
        'borderBottomRightRadius': '4px'
    }
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
