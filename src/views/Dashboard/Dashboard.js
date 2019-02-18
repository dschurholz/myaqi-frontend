import React, { Component } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Row
} from 'reactstrap';
import { SiteMap, QuerySiteDetails, MeasurementsTable } from '../../components';

class Dashboard extends Component {
  loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>

  render() {

    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs="12" sm="6" lg="6">
            <Card className="text-black map-card">
              <CardHeader>
                <i className="fa fa-align-justify"></i> Sites Map
              </CardHeader>
              <CardBody className="pb-0">
                <SiteMap />
              </CardBody>
            </Card>
          </Col>
          <Col xs="12" sm="6" lg="6">
            <Card className="text-black site-list-card">
              <CardHeader>
                <i className="fa fa-align-justify"></i> Site Details
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

export default Dashboard;
