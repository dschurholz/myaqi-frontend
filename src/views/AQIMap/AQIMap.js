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
import { SiteMap, QuerySiteDetails, MeasurementsTable, MeasurementsCharts, AQNotifications } from '../../components';
import { store } from '../../stores';

import { utils } from '../../utils';
import { getSites, getAQIScales } from '../../actions'
import { SettingsService } from '../../services';

const CHARTS = 'CHARTS';
const TABLE = 'TABLE';
const SITE_DETAILS = 'SITE_DETAILS';
const GAUGE = 'GAUGE';
const NOTIFICATIONS = 'NOTIFICATIONS';
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
      activeTabDetails: SITE_DETAILS,
      currentSiteName: '',
      currentSiteDesc: 'No value yet.',
      currentSiteAQI: 0,
      currentSiteAQIBgColor: '#0288D1',
      currentSiteAQIFgColor: '#FFF',
      headerStationIcon: 'data:image/svg+xml;utf-8,' + utils.svgIcons.getGaugeIcon("light"),
      stationIcon: 'data:image/svg+xml;utf-8,' + utils.svgIcons.getGaugeIcon("light"),
      notificationsNum: 0,
      notificationsColor: 'warning',
    };
    
    this.toggle = this.toggle.bind(this);
    this.toggleGauge = this.toggleGauge.bind(this);
    this.onSiteChange = this.onSiteChange.bind(this);
    this.onNotifications = this.onNotifications.bind(this);
  }
  
  componentDidMount() {
    store.dispatch(getSites()); 
    store.dispatch(getAQIScales());   
  }

  toggleGauge(tab) {
    this.setState({
      activeTabDetails: tab
    });
  }

  toggle(tab) {
    this.setState({
      activeTab: tab
    });
  }

  onNotifications (notificationsNum, notificationsColor) {
    this.setState({
      notificationsNum: notificationsNum,
      notificationsColor: notificationsColor
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
    const { activeTabDetails, activeTab, currentSiteName, currentSiteAQI, currentSiteDesc,
            stationIcon, headerStationIcon, currentSiteAQIBgColor, currentSiteAQIFgColor,
            notificationsNum, notificationsColor } = this.state,
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
            <Nav tabs style={{ backgroundColor: '#c8ced3' }}>
              <NavItem>
                <NavLink
                  active={activeTabDetails === SITE_DETAILS}
                  onClick={() => { this.toggleGauge(SITE_DETAILS); }}
                  style={{ paddingTop: '10px', paddingBottom: '10px' }}
                >
                  <i className="fa fa-align-justify"></i>&nbsp;Sites Details
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  active={activeTabDetails === GAUGE}
                  onClick={() => { this.toggleGauge(GAUGE); }}
                  style={{ paddingTop: '10px', paddingBottom: '10px' }}
                >
                  <img src={headerStationIcon} height="17" className="float-left" onClick={() => { this.toggleGauge(); }} alt={ currentSiteAQI } style={{ marginTop: '2px' }} />&nbsp;Current AQI 
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  active={activeTabDetails === NOTIFICATIONS}
                  onClick={() => { this.toggleGauge(NOTIFICATIONS); }}
                  style={{ paddingTop: '10px', paddingBottom: '10px' }}
                >
                  <i className="fa fa-bell"></i>&nbsp;Notifications&nbsp;{notificationsNum > 0 ? <Badge color={ notificationsColor }>{ notificationsNum }</Badge> : ''}
                </NavLink>
              </NavItem>
            </Nav>
            <TabContent activeTab={activeTabDetails} style={{ height: '610px', overflowY: 'scroll' }}>
              <TabPane tabId={SITE_DETAILS}>
                <QuerySiteDetails onChange={this.onSiteChange} />
              </TabPane>
              <TabPane tabId={GAUGE}>
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
              <TabPane tabId={NOTIFICATIONS}>
                <AQNotifications onNotifications={this.onNotifications} />
              </TabPane>
            </TabContent>
          </Col>
         </Row>
         <Row>
          <Col xs="12" sm="12" lg="12">
            <Nav tabs style={{ backgroundColor: '#c8ced3' }}>
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
