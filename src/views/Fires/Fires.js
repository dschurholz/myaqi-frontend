import React, { Component } from 'react';
import { connect } from 'react-redux';
import Moment from 'react-moment';
import 'moment-timezone';
import {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Col,
  Row
} from 'reactstrap';
import { FireMap, SvgIcon, SelectedFireDetails } from '../../components';
import { store } from '../../stores'

import { getAllFires } from '../../actions';
import { utils } from '../../utils';


class Fires extends Component {
  componentDidMount() {
    store.dispatch(getAllFires());    
  }

  loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>

  render() {
    const { isFetchingFires, fires } = this.props;

    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs="12" sm="6" lg="6">
            <Card className="text-black map-card">
              <CardHeader>
                <SvgIcon width="30" height="25" url="images/fire_map_icons.svg" icon="markers--incident--Fire_Active" /> Fires Map
              </CardHeader>
              <CardBody className="pb-0">
                <FireMap scaleMarkers={[24, 24]} loaderHeight="300px" loaderMargin="150px" />
              </CardBody>
              <CardFooter>
                <strong>Source of data: State of Victoria, Australia.</strong> To know more follow this link: <a href="https://www.emv.vic.gov.au/responsibilities/victorias-warning-system/emergency-data" target="_blank">Emergency Data</a>
              </CardFooter>
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
              <CardFooter>
                <strong>Data updated on:</strong>&nbsp;<i>{
                  isFetchingFires ?
                  utils.loaders.StandardLoader()
                  :
                  (
                    (!fires || !fires.properties) ?
                    'No data available.'
                    :
                    <Moment parse="YYYY-MM-DDTHH:mm:ss.SSSZ" format="LLL" tz="Australia/Melbourne">
                      { fires.properties.lastUpdated }
                    </Moment>
                  )
                }</i>
              </CardFooter>
            </Card>
          </Col>
        </Row>

      </div>
    );
  }
}

const mapStateToProps = state => {
  const { fires, isFetchingFires } = state.fires;
  return {
    fires,
    isFetchingFires
  };
};

export default connect(
  mapStateToProps,
  null
)(Fires);

