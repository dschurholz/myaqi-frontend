// QuerySiteDetails.js

import { connect } from 'react-redux';
import { getMeasurementsByQuery } from '../../actions';
import SiteDetails from '../SiteDetails';

const mapStateToProps = state => {
  return {
    selectedSite: state.selectedSite
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onUpdateTable: query => {
      dispatch(getMeasurementsByQuery(query));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SiteDetails);