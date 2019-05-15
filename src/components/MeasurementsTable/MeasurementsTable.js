// MeasurementsTable.js

import React from 'react';
import { connect } from 'react-redux';
import { Table } from 'reactstrap';

import { utils } from "../../utils";
import MeasurementsTableRow from '../MeasurementsTableRow';

class MeasurementsTable extends React.Component {

  render () {
    const { measurements, isFetchingMeasurements, getAQIScaleCustom, aqiScale, pollutant } = this.props,
          isEmpty = measurements.length === 0;

    return (
      <Table responsive>
        <thead>
          <tr>
            <th>Starting Date</th>
            <th>Starting Time</th>
            <th>SiteId</th>
            <th>Monitor</th>
            <th>Value</th>
            <>
              {
                pollutant !== 'aqi' ?
                <th>AQI Index</th> :
                <></>
              }
            </>
            <th>AQI Category Description</th>
          </tr>
        </thead>
        <tbody>
        {!isEmpty
          ?
          measurements.map(measurement => {
            return (
              <MeasurementsTableRow measurement={ measurement } key={ measurement.DateTimeStart } getAQIScaleCustom={getAQIScaleCustom} aqiScale={aqiScale} pollutant={pollutant}/>
            );
          })
          :
          <tr>
            <td colSpan="7" style={{textAlign: "center", maxHeight: '100px'}}>
              {isFetchingMeasurements ? utils.loaders.TableLoader({style: { height: '100px' }}) : <h5>No measurements available.</h5>}
            </td>
          </tr>
        }
        </tbody>
      </Table>
    );
  }
}

function parseAqiScale (pollutant='aqi', aqiScale=null) {
  if (!aqiScale) return null;
  const extraCheck = utils.aqiScaleTools.extraChecks(aqiScale.abbreviation),
        extended = true,
        aqiThresholds = utils.charts.parseScale(aqiScale, pollutant, extraCheck, extended);

  return (val) => {
    let thresh;
    for (thresh in aqiThresholds.upperLimits) {
      if (val < aqiThresholds.upperLimits[thresh]) {
        break;
      }
    }
    return {
      bgColour: aqiThresholds.backgroundColors[thresh],
      description: aqiThresholds.descriptions[thresh],
      fgColour: aqiThresholds.foregroundColors[thresh]
    };
  }
}

const mapStateToProps = state => {
  const { currentUser } = state,
        { measurements, isFetchingMeasurements } = state.measurements,
        { aqiScales } = state.aqiScales,
        user = currentUser.user || utils.auth.getUser(),
        aqiScale = utils.aqiScaleTools.getUserAqiScale(aqiScales, user),
        pollutant = measurements && measurements.Parameters ?
        utils.charts.getMeasurementPollutantName(measurements.Parameters): 'aqi';

  return {
    isFetchingMeasurements,
    measurements: measurements.Measurements || [],
    getAQIScaleCustom: parseAqiScale(pollutant, aqiScale),
    pollutant: utils.aqiScaleTools.normalizePollutantId(pollutant),
    aqiScale
  };
};

export default connect(
  mapStateToProps,
  null
)(MeasurementsTable);