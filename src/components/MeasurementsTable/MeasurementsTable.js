// MeasurementsTable.js

import React from 'react';
import { connect } from 'react-redux';
import { Table } from 'reactstrap';

import { utils } from "../../utils";
import MeasurementsTableRow from '../MeasurementsTableRow';

function MeasurementsTable({ measurements, isFetchingMeasurements }) {
  const isEmpty = measurements.length === 0;
  return (
    <Table responsive>
      <thead>
        <tr>
          <th>Starting Date</th>
          <th>Starting Time</th>
          <th>SiteId</th>
          <th>Monitor</th>
          <th>Value</th>
          <th>AQI Index</th>
          <th>AQI Category Description</th>
        </tr>
      </thead>
      <tbody>
      {!isEmpty
        ?
        measurements.map(measurement => {
          return (
            <MeasurementsTableRow measurement={ measurement } key={ measurement.DateTimeStart } />
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

const mapStateToProps = state => {
  console.log(state);
  return {
    measurements: state.measurements.measurements,
    isFetchingMeasurements: state.measurements.isFetchingMeasurements
  };
};

export default connect(
  mapStateToProps,
  null
)(MeasurementsTable);