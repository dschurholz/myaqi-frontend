import React, { Component } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Row
} from 'reactstrap';
import { AppSwitch } from '@coreui/react'
import { TrafficMap } from '../../components';
import { store } from '../../stores'

// eslint-disable-next-line
import { getBingTraffic, getVicRoadsTraffic } from '../../actions';
import bingLogo from '../../assets/img/bing-logo.png';
import vicRoadsLogo from '../../assets/img/vicRoads.png';

class Traffic extends Component {

  constructor (props) {
    super(props);

    this.state = {
      apis: {
        bing: {
          collected: false,
          isActive: true
        },
        vicRoads: {
          collected: false,
          isActive: false
        }
      }
    };
  }
  
  componentDidMount() {
    var apis;
    if (this.state.apis.bing.isActive) {
      store.dispatch(getBingTraffic());
      apis = this.state.apis;
      apis.bing.collected = true;
      this.setState({
        apis: apis
      });
    }
    if (this.state.apis.vicRoads.isActive) {
      store.dispatch(getVicRoadsTraffic());
      apis = this.state.apis;
      apis.vicRoads.collected = true;
      this.setState({
        apis: apis
      });
    }
  }

  handleSwitchChange = e => {
    var apis = this.state.apis;
    apis[e.target.name].isActive = !apis[e.target.name].isActive;

    if (apis.bing.isActive && !apis.bing.collected) {
      store.dispatch(getBingTraffic());
      apis.bing.collected = true;

    }
    if (apis.vicRoads.isActive && !apis.vicRoads.collected) {
      store.dispatch(getVicRoadsTraffic());
      apis.vicRoads.collected = true;
    }
    this.setState({
      apis: apis
    });
  };

  loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>

  render() {

    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs="12" sm="12" lg="12">
            <Card className="text-black map-card">
              <CardHeader className="header-with-switches">
                <span className="header-title">
                  <i className="fa fa-car"></i> Traffic Map
                </span>
                <div className="float-right switch-img-group">
                  <img src={bingLogo} height="20" alt="Bing Logo" />
                  <AppSwitch size="sm" className={'mx-1'} color={'primary'} checked onChange={ this.handleSwitchChange } name="bing" value="bing"/>
                  <img src={vicRoadsLogo} height="20" alt="Vic Roads Logo" />
                  <AppSwitch size="sm" className={'mx-1'} color={'primary'} onChange={ this.handleSwitchChange } name="vicRoads" value="vicRoads"/>
                </div>
              </CardHeader>
              <CardBody className="pb-0">
                <TrafficMap scaleMarkers={[24, 24]} loaderHeight="600px" loaderMargin="0px" apiSources={{bing: this.state.apis.bing.isActive, vicRoads: this.state.apis.vicRoads.isActive}} emptyText="Select a data source from the header." />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Traffic;
