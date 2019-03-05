import React, { Component } from 'react';
import ContentLoader from "react-content-loader";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Row
} from 'reactstrap';
import { SiteMap, QuerySiteDetails, MeasurementsTable } from '../../components';
import { store } from '../../stores'

import { utils } from '../../utils';
import { getSites } from '../../actions'


class AIQMap extends Component {

  loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>;

  componentDidMount() {
    store.dispatch(getSites());    
  }

  render() {

    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs="12" sm="6" lg="6">
            <Card className="text-black map-card">
              <CardHeader>
                <i className="fa fa-globe"></i> Sites Map
              </CardHeader>
              <CardBody className="pb-0">
                <SiteMap scaleMarkers={[40, 40]} loaderHeight="300px" loaderMargin="150px 0px" />
              </CardBody>
            </Card>
          </Col>
          <Col xs="12" sm="6" lg="6">
            <Card className="text-black site-list-card">
              <CardHeader>
                <img src={'data:image/svg+xml;utf-8,' + utils.svgIcons.getFireIcon("markers--AQI--Gauge--light")} width="25" height="25" /> Site Details
              </CardHeader>
              <CardBody>
                <QuerySiteDetails />
              </CardBody>
            </Card>
          </Col>
         </Row>
         <Row>
          <Col xs="12" sm="12" lg="12">
            <Card className="text-black map-card">
              <CardHeader>
                <i className="fa fa-align-justify"></i> Measurements
              </CardHeader>
              <CardBody className="pb-0">
                <MeasurementsTable />
              </CardBody>
            </Card>
          </Col>
         </Row>
      </div>
    );
  }
}

export default AIQMap;
