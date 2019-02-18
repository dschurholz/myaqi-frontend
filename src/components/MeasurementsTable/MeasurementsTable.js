// MeasurementsTable.js

import React from 'react';
import { connect } from 'react-redux';
import { Table } from 'reactstrap';
import MeasurementsTableRow from '../MeasurementsTableRow';

function MeasurementsTable({ measurements }) {
  if(!measurements.length) {
    return (
      <div>
        No measurements available
      </div>
    )
  }
  return (
    <Table responsive>
      <thead>
        <tr>
          <th>Starting Date/Time</th>
          <th>SiteId</th>
          <th>Monitor</th>
          <th>Value</th>
          <th>AQI Index</th>
          <th>AQI Category Description</th>
        </tr>
      </thead>
      <tbody>
        {measurements.map(measurement => {
          return (
            <MeasurementsTableRow measurement={ measurement } key={ measurement.DateTimeStart } />
          );
        })}
      </tbody>
    </Table>
  );
}

const mapStateToProps = state => {
  return {
    measurements: state.measurements
  };
};

export default connect(
  mapStateToProps,
  null
)(MeasurementsTable);