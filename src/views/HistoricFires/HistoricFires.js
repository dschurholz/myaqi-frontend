import React, { Component } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Row
} from 'reactstrap';
import { HistoricFireMap, HistoricalFireDetails } from '../../components';
import { store } from '../../stores';
import { getHistoricAllFires } from '../../actions';


class HistoricFires extends Component {
  loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>

  componentDidMount() {
    store.dispatch(getHistoricAllFires({ season:2018, limit: 100 }));    
  }

  render() {

    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs="12" sm="6" lg="6">
            <Card className="text-black map-card">
              <CardHeader>
                <i className="fa fa-align-justify"></i> Historical Fires Map Seasons 2017-2018
              </CardHeader>
              <CardBody className="pb-0">
                <HistoricFireMap scaleMarkers={[24, 24]} loaderHeight="300px" loaderMargin="150px" />
              </CardBody>
            </Card>
          </Col>
          <Col xs="12" sm="6" lg="6">
            <Card className="text-black site-list-card">
              <CardHeader>
                <i className="fa fa-align-justify"></i> Historical Fire Details
              </CardHeader>
              <CardBody>
                <HistoricalFireDetails />
              </CardBody>
            </Card>
          </Col>
         </Row>
         {/*<Row>
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
         </Row>*/}
      </div>
    );
  }
}

export default HistoricFires;
