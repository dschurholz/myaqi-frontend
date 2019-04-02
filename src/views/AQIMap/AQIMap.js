import React, { Component } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane
} from 'reactstrap';
import { SiteMap, QuerySiteDetails, MeasurementsTable, MeasurementsCharts } from '../../components';
import { store } from '../../stores';

import { utils } from '../../utils';
import { getSites, getAQIScales } from '../../actions'

const CHARTS = 'CHARTS';
const TABLE = 'TABLE';


class AQIMap extends Component {
  
  loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>;

  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      activeTab: CHARTS
    };
  }
  
  componentDidMount() {
    store.dispatch(getSites()); 
    store.dispatch(getAQIScales());   
  }

  toggle(tab) {
    this.setState({
      activeTab: tab
    });
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
            <Nav tabs>
              <NavItem>
                <NavLink
                  active={this.state.activeTab === CHARTS}
                  onClick={() => { this.toggle(CHARTS); }}
                >
                  Measurements Charts
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  active={this.state.activeTab === TABLE}
                  onClick={() => { this.toggle(TABLE); }}
                >
                  Measurements Table
                </NavLink>
              </NavItem>
            </Nav>
            <TabContent activeTab={this.state.activeTab}>
              <TabPane tabId={CHARTS}>
                <MeasurementsCharts />
              </TabPane>
              <TabPane tabId={TABLE}>
                <MeasurementsTable />
              </TabPane>
            </TabContent>
          </Col>
         </Row>
      </div>
    );
  }
}

export default AQIMap;
