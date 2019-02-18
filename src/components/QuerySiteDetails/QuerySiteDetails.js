// QuerySiteDetails.js

import React from 'react';
import { connect } from 'react-redux';
import { fetchMeasurementsByQuery } from '../../actions';
import SiteDetails from '../SiteDetails';

const mapStateToProps = state => {
  return {
    selectedSite: state.selectedSite
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onUpdateTable: query => {
      dispatch(fetchMeasurementsByQuery(query));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SiteDetails);