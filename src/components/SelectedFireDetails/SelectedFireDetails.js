// SelectedFireDetails.js

import React from 'react';
import { connect } from 'react-redux';
import FireDetails from '../FireDetails';

const mapStateToProps = state => {
  return {
    selectedFire: state.selectedFire
  };
};

export default connect(
  mapStateToProps,
  null
)(FireDetails);