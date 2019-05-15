import React, { Component } from 'react';
import {
  Badge,
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
import { SettingsService } from '../../services';

const CHARTS = 'CHARTS';
const TABLE = 'TABLE';
const STATUS_STYLE = {
  backgroundColor: '#0288D1',
  borderRadius: '25px',
  textAlign: 'center',
  verticalAlign: 'middle',
  lineHeight: '35px',
  color: 'white'
}

class AQIMap extends Component {
  
  loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>;

  constructor(props) {
    super(props);

    this.state = {
      activeTab: CHARTS,
      activeGauge: false,
      currentSiteName: '',
      currentSiteDesc: 'No value yet.',
      currentSiteAQI: 0,
      currentSiteAQIBgColor: '#0288D1',
      currentSiteAQIFgColor: '#FFF',
      headerStationIcon: 'data:image/svg+xml;utf-8,' + utils.svgIcons.getGaugeIcon("light"),
      stationIcon: 'data:image/svg+xml;utf-8,' + utils.svgIcons.getGaugeIcon("light"),
    };
    
    this.toggle = this.toggle.bind(this);
    this.toggleGauge = this.toggleGauge.bind(this);
    this.onSiteChange = this.onSiteChange.bind(this);
  }
  
  componentDidMount() {
    store.dispatch(getSites()); 
    store.dispatch(getAQIScales());   
  }

  toggleGauge() {
    const { activeGauge } = this.state;
    this.setState({
      activeGauge: !activeGauge
    });
  }

  toggle(tab) {
    this.setState({
      activeTab: tab
    });
  }

  onSiteChange(siteName, aqiValue, aqiScaleLimits, aqiScaleColors, aqiScaleParsed) {
    const { currentSiteAQI, currentSiteName, currentSiteDesc, currentSiteAQIBgColor, currentSiteAQIFgColor } = this.state;
    const { gaugeTheme } = SettingsService.getSettings();

    this.setState({
      currentSiteAQI: aqiValue || currentSiteAQI,
      currentSiteName: siteName || currentSiteName,
      currentSiteDesc: (aqiScaleParsed ? aqiScaleParsed(aqiValue).description : currentSiteDesc),
      currentSiteAQIBgColor: (aqiScaleParsed ? aqiScaleParsed(aqiValue).bgColour : currentSiteAQIBgColor),
      currentSiteAQIFgColor: (aqiScaleParsed ? aqiScaleParsed(aqiValue).fgColour : currentSiteAQIFgColor),
      headerStationIcon: 'data:image/svg+xml;utf-8,' + utils.svgIcons.getGaugeIcon(gaugeTheme, aqiValue, aqiScaleLimits, aqiScaleColors, false, true),
      stationIcon: 'data:image/svg+xml;utf-8,' + utils.svgIcons.getGaugeIcon(gaugeTheme, aqiValue, aqiScaleLimits, aqiScaleColors, gaugeTheme === "dark" ? false : true, true),
    });
  }

  render() {
    const { activeGauge, activeTab, currentSiteName, currentSiteAQI, currentSiteDesc,
            stationIcon, headerStationIcon, currentSiteAQIBgColor, currentSiteAQIFgColor } = this.state,
          newStatusStyle = Object.assign(
            {}, STATUS_STYLE, { backgroundColor: currentSiteAQIBgColor, color: currentSiteAQIFgColor });

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
                <i className="fa fa-align-justify"></i> Sites Details
                <div className="site-details-toggle float-right" onClick={() => { this.toggleGauge(); }} >
                  { !activeGauge ? 'Current AQI' : 'Details' } &nbsp;&nbsp;
                  { !activeGauge ?
                    <img src={headerStationIcon} height="17" className="float-right" onClick={() => { this.toggleGauge(); }} alt={ currentSiteAQI } />
                    : <i className="fa fa-align-justify"></i>
                  }
                </div>
              </CardHeader>
              <CardBody>
                <TabContent style={{border: 'none'}} activeTab={activeGauge}>
                <TabPane className="p-0" tabId={false}>
                  <QuerySiteDetails onChange={this.onSiteChange} />
                </TabPane>
                <TabPane className="p-0" tabId={true}>
                  <Row>
                    <Col xs="12" sm="12" lg="12">
                      <div className="avatar float-right" style={newStatusStyle}>
                        { currentSiteAQI }
                      </div>
                      <h2>{currentSiteName}</h2>
                      <p>Air Quality is currently <Badge size="lg" color="primary" style={currentSiteAQIBgColor ? {backgroundColor: currentSiteAQIBgColor, color: currentSiteAQIFgColor } : {}}>{ currentSiteDesc }</Badge></p>
                      <img style={{height: '45vh'}}src={stationIcon} width="100%" alt={ "AQI Current Value " + currentSiteAQI }/> 
                    </Col>
                  </Row>
                </TabPane>
              </TabContent>
              </CardBody>
            </Card>
          </Col>
         </Row>
         <Row>
          <Col xs="12" sm="12" lg="12">
            <Nav tabs>
              <NavItem>
                <NavLink
                  active={activeTab === CHARTS}
                  onClick={() => { this.toggle(CHARTS); }}
                >
                  Measurements Charts
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  active={activeTab === TABLE}
                  onClick={() => { this.toggle(TABLE); }}
                >
                  Measurements Table
                </NavLink>
              </NavItem>
            </Nav>
            <TabContent activeTab={activeTab}>
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
