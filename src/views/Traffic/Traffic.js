import React, { Component } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Row
} from 'reactstrap';
import { TrafficMap } from '../../components';
import { store } from '../../stores'

import { getAllTraffic } from '../../actions'


class Traffic extends Component {
  
  componentDidMount() {
    store.dispatch(getAllTraffic());    
  }

  loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>

  render() {

    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs="12" sm="12" lg="12">
            <Card className="text-black map-card">
              <CardHeader>
                <i className="fa fa-car"></i> Traffic Map
              </CardHeader>
              <CardBody className="pb-0">
                <TrafficMap scaleMarkers={[32, 32]} loaderHeight="600px" loaderMargin="0px" />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Traffic;
