// MeasurementsCharts.js

import React, { Component, Suspense } from 'react';
import { connect } from 'react-redux';
import {
  Col,
  Row
} from 'reactstrap';
import Moment from 'react-moment';
import * as moment from 'moment';
import { Chart, Line } from 'react-chartjs-2';

import { updateQuery } from '../../actions';
import { utils } from "../../utils";

class MeasurementsCharts extends Component {
  loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>

  componentWillMount() {
    Chart.pluginService.register(utils.charts.aqiBeforeDrawPlugin);
  }

  render () {
    const { measurements, isFetchingMeasurements } = this.props; 
    if(isFetchingMeasurements) {
      return (
        <div>
          {utils.loaders.TableLoader({style: { height: '100px' }})}
        </div>
      );
    }
    if(!measurements.data || measurements.data.length === 0) {
      return (
        <div>
          <h5>No measurements available.</h5>
        </div>
      );
    }
    return (
      <Suspense fallback={this.loading()}>
        <h2>{measurements.title}</h2>
        { 
          measurements.data.map(measurement => {
            return (
              <Row key={measurement.pollutantName}>
                <Col xs="12" sm="12" lg="12">
                  <h4>{measurement.pollutantName}</h4>
                  <Line data={measurement.data} options={utils.charts.aqiDefaultOptions} />
                </Col>
              </Row>
            );
          })
        }
      </Suspense>
    );
  }
};

function prepareMeasurementsForCharts (measurements) {
  const parseParamStart = 'MonitorId: ',
        parseParamEnd = 'TimeBasisId',
        parseParamStartLen = parseParamStart.length;
  var pollutantName = measurements.Parameters.substr(measurements.Parameters.indexOf(parseParamStart) + parseParamStartLen, measurements.Parameters.indexOf(parseParamEnd)-(measurements.Parameters.indexOf(parseParamStart) + parseParamStartLen) - 1),
    pollutants = {
        'sp_AQI': {
          color: 'rgba(75,192,192'
        },
        'API': {
          color: 'rgba(75,192,192'
        },
        'SO2': {
          color: 'rgba(192,75,192'
        },
        'NO2': {
          color: 'rgba(192,192,75'
        },
        'CO': {
          color: 'rgba(75,75,192'
        },
        'BPM2.5': {
          color: 'rgba(75,192,75'
        },
        'iPM2.5': {
          color: 'rgba(75,192,75'
        },
        'PM10': {
          color: 'rgba(192,75,75'
        },
        'O3': {
          color: 'rgba(75,127,192'
        },
        'DBT': {
          color: 'rgba(75,127,192'
        },
        'VWS': {
          color: 'rgba(75,127,192'
        },
        'VWD': {
          color: 'rgba(75,127,192'
        },
        'SWS': {
          color: 'rgba(75,127,192'
        }
      },
      results = {
        title: measurements.Parameters,
        data: []
    },
    labels = [],
    data = [];

  measurements.Measurements.forEach((measurement, index) => {
    labels.push(moment(measurement['DateTimeStart']).format("dd Do, HHA"));
    data.push(measurement['Value']);
  });

  results.data.push({
    pollutantName: pollutantName,
    data: {
      labels: labels,
      datasets: [
        {
          label: pollutantName,
          fill: false,
          lineTension: 0.1,
          backgroundColor: pollutants[pollutantName].color + ',0.4)',
          borderColor: pollutants[pollutantName].color + ',1)',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: 'rgba(75,192,192,1)',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'rgba(75,192,192,1)',
          pointHoverBorderColor: 'rgba(220,220,220,1)',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: data,
        },
      ]
    }
  });

  return results;
}

const mapStateToProps = state => {
  var measurements = (state.measurements.measurements.Measurements) ? prepareMeasurementsForCharts(state.measurements.measurements): {};
  return {
    measurements: measurements,
    isFetchingMeasurements: state.measurements.isFetchingMeasurements
  };
};

export default connect(
  mapStateToProps,
  null
)(MeasurementsCharts);