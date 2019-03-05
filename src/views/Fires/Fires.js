import React, { Component } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Row
} from 'reactstrap';
import { FireMap, SvgIcon, SelectedFireDetails } from '../../components';
import { store } from '../../stores'

import { getAllFires } from '../../actions'


class Fires extends Component {
  componentDidMount() {
    store.dispatch(getAllFires());    
  }

  loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>

  render() {

    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs="12" sm="6" lg="6">
            <Card className="text-black map-card">
              <CardHeader>
                <SvgIcon width="30" height="25" url="images/fire_map_icons.svg" icon="markers--incident--Fire_Active" /> Fires Map
              </CardHeader>
              <CardBody className="pb-0">
                <FireMap scaleMarkers={[32, 32]} loaderHeight="300px" loaderMargin="150px" />
              </CardBody>
            </Card>
          </Col>
          <Col xs="12" sm="6" lg="6">
            <Card className="text-black fire-list-card">
              <CardHeader>
                <SvgIcon width="30" height="25" url="images/fire_map_icons.svg" icon="markers--warning--Community_Update" /> Information
              </CardHeader>
              <CardBody>
                <SelectedFireDetails />
              </CardBody>
            </Card>
          </Col>
        </Row>

      </div>
    );
  }
}

export default Fires;
