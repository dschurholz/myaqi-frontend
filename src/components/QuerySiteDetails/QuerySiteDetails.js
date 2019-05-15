// QuerySiteDetails.js

import { connect } from 'react-redux';
import { getMeasurementsByQuery } from '../../actions';
import SiteDetails from '../SiteDetails';
import { utils } from '../../utils';

const mapStateToProps = state => {
  const { currentUser, selectedSite } = state,
        { aqiScales } = state.aqiScales,
        user = currentUser.user || utils.auth.getUser(),
        aqiScale = utils.aqiScaleTools.getUserAqiScale(aqiScales, user);

  var aqiThresholds = [], aqiScaleParsed = null;
  if (aqiScale) {
    var extraCheck = utils.aqiScaleTools.extraChecks(aqiScale.abbreviation), extended = true;
    aqiThresholds = utils.charts.parseScale(aqiScale, 'aqi', extraCheck, extended);
    aqiScaleParsed = utils.aqiScaleTools.parseAqiScale('aqi', aqiScale);
  }

  return {
    selectedSite,
    aqiThresholds,
    aqiScaleParsed
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