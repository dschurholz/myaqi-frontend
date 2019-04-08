import React, { Component } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Row
} from 'reactstrap';
import { ForecastMap, ForecastPointDetails } from '../../components';
import { store } from '../../stores';

import { utils } from '../../utils';
import { getAQIScales } from '../../actions'


class AQIForecastMap extends Component {

  loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>;

  componentDidMount() {
    store.dispatch(getAQIScales());   
  }

  render() {

    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs="12" sm="12" lg="12">
            <Card className="text-black map-card">
              <CardHeader>
                <i className="fa fa-globe"></i> Forecasts Map
              </CardHeader>
              <CardBody className="pb-0">
                <ForecastMap scaleMarkers={[40, 40]} loaderHeight="300px" loaderMargin="150px 0px" />
              </CardBody>
            </Card>
          </Col>
          <Col xs="12" sm="12" lg="12">
            <Card className="text-black">
              <CardHeader>
                <img src={'data:image/svg+xml;utf-8,' + utils.svgIcons.getGaugeIcon("light")} width="25" height="25" alt=""/> Forecast Details
              </CardHeader>
              <CardBody>
                <ForecastPointDetails />
              </CardBody>
            </Card>
          </Col>
         </Row>
      </div>
    );
  }
}

export default AQIForecastMap;
