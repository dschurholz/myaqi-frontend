// ForecastDetails.js

import React, { Component, Suspense } from 'react';
import {
  Col,
  Row
} from 'reactstrap';
import { Line, Chart } from 'react-chartjs-2';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import { utils } from "../../utils";


class ForecastDetails extends Component {
  loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>

  componentWillMount() {
    Chart.pluginService.register(utils.charts.aqiBeforeDrawPlugin);
  }

  render () {
    const { forecasts, isFetchingAqiForecasts } = this.props; 
    if(isFetchingAqiForecasts) {
      return (
        <div>
          Fetching forecast.
        </div>
      );
    }
    if(!forecasts.data || forecasts.data.length === 0) {
      return (
        <div>
          Select a point on the map.
        </div>
      );
    }
    return (
      <Suspense fallback={this.loading()}>
        <h2>{forecasts.cityName}, {forecasts.country}</h2>
        <p>Time zone: {forecasts.timeZone}</p>
        { 
          forecasts.data.map(forecast => {
            return (
              <Row key={forecast.pollutantName}>
                <Col xs="12" sm="12" lg="12">
                  <h4>{forecast.pollutantName}</h4>
                  <Line data={forecast.data} options={utils.charts.aqiDefaultOptions} />
                </Col>
              </Row>
            );
          })
        }
      </Suspense>
    );
  }
};

export default ForecastDetails;