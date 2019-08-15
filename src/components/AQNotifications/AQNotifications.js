// AQNotifications.js

import React, { Component, Suspense } from 'react';
import { connect } from 'react-redux';
import {
  Badge,
  Col,
  ListGroup,
  ListGroupItem,
  Row
} from 'reactstrap';
import { utils } from "../../utils";

const STATUS_STYLE = {
  backgroundColor: '#0288D1',
  borderRadius: '25px',
  textAlign: 'center',
  verticalAlign: 'middle',
  lineHeight: '35px',
  color: 'white'
}

const CITY_SITES = [10001, 10227, 10239, 10006, 10213, 10003, 10007, 10042];

class AQNotifications extends Component {
  loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>

  componentDidUpdate (prevProps) {
    const { notifications, onNotifications } = this.props;

    if (onNotifications && typeof onNotifications === 'function' && notifications.length > 0) {
      onNotifications(notifications.length, notifications[0].color);
    }
  } 

  render () {
    const { notifications, isFetchingData, aqiThresholds } = this.props;
    
    if((!notifications || notifications.length === 0) && isFetchingData) {
      return (
        <div>
           {utils.loaders.TableLoader({style: { height: '100px' }})}
        </div>
      );
    }
    if((!notifications || notifications.length === 0) && !isFetchingData) {
      return (
        <div className="pl-4 pt-4">
          No notifications, have a lovely day!
        </div>
      );
    }

    return (
      <Suspense fallback={this.loading()}>
        {/*<h5 style={{textAlign: 'center'}}>Date: <Moment format="YYYY-MM-DD HH">{ selectedDate }</Moment>h</h5>*/}
        <Row className="ml-0 mr-0">
          <Col className="pl-0 pr-0" xs="12" sm="12" lg="12">
            <ListGroup className="list-group-accent">
              {
                notifications.map(notif => {
                  const aqiValue = notif.currentAQIVal,
                        aqiStyles = aqiThresholds ? {
                          bgColour: aqiThresholds.backgroundColors[notif.aqiCategory],
                          fgColour: aqiThresholds.foregroundColors[notif.aqiCategory],
                          abbreviation: aqiThresholds.abbreviations[notif.aqiCategory],
                          description: aqiThresholds.descriptions[notif.aqiCategory]
                        } : null,
                        newStatusStyle = aqiStyles ? Object.assign({}, STATUS_STYLE, { backgroundColor: aqiStyles.bgColour, color: aqiStyles.fgColour }) : STATUS_STYLE;
                    console.log(aqiStyles, notif.aqiCategory)
                  return (
                    <ListGroupItem key={notif.site.site_id + notif.pollutant} action tag="a" className={'list-group-item-accent-' + notif.color + ' list-group-item-divider'}>
                      {
                        (aqiValue && aqiStyles) ?
                          <div className="avatar float-right" style={newStatusStyle}>
                            { aqiStyles.abbreviation }
                          </div>
                        : <></>
                      }
                      <div><strong>{notif.site.name}</strong> </div>
                      <div>A <Badge color="primary" style={aqiStyles ? {backgroundColor: aqiStyles.bgColour, color: aqiStyles.fgColour } : {}}>{aqiStyles ? aqiStyles.description : 'dangerous'}</Badge> air quality level was detected around this station, due to {notif.aqiCategory === 2 ? 'high' : (notif.aqiCategory === 3 ? 'very high' : 'extremely high' )} concentrations of <strong>{ notif.pollutant.toUpperCase() }</strong>, due to high levels of <i>{CITY_SITES.includes(notif.site.site_id)? 'Traffic Volumes' : 'Smoke from a nearby Fire'}!</i></div>
                      <div className="text-danger">{notif.description}</div>
                    </ListGroupItem>    
                  );
                })
              }
            </ListGroup>
          </Col>
        </Row>
      </Suspense>
    );
  }
};

function _prepareNotifications(sites, sensitivityLevels) {
  var notifications = [];

  function getCurrentMonitorAQIVal (currentStatus, pollutant) {
    if (!currentStatus) return -1;
    for (let s in currentStatus) {
      let monitor = currentStatus[s];
      if (utils.aqiScaleTools.normalizePollutantId(monitor.name) === pollutant) {
        return monitor.aqi_value;
      }
    };
    return -1;
  };

  sites.forEach(site => {
    sensitivityLevels.forEach(level => {
      const currentVal = getCurrentMonitorAQIVal(site.current_status, level.pollutant_id);
      if (currentVal < 0) return;
      const category = utils.aqiScaleTools.sensitivityChecks(currentVal, level.level, 'AUEPA'); 

      if (category >= 2) {
        notifications.push({
          color: category === 2 ? 'warning' : (category === 3 ? 'danger' : 'dark'),
          aqiCategory: category,
          level: level.level_display,
          pollutant: level.pollutant_id,
          description: category === 2 ? `Current and near-future ${level.pollutant_id.toUpperCase()} levels can be dangerous for you,
            if exposed for a long time. Levels may suddenly rise, stay alert for further notifications.` :
            `Current and near-future ${level.pollutant_id.toUpperCase()} levels are very dangerous for you, avoid this area and move towards an environment with cleaner air, immediately.`,
          currentAQIVal: currentVal,
          site: site
        });
      }
    });
  });

  notifications.sort((n1, n2) => {
    if (n1.aqiCategory > n2.aqiCategory) return -1;
    if (n1.aqiCategory < n2.aqiCategory) return 1;
    return 0;
  });
  return notifications;
}

const mapStateToProps = state => {
  const { currentUser } = state,
        { aqiScales, isFetchingAqiScales } = state.aqiScales,
        { sites, isFetchingSites } = state.sites,
        user = currentUser.user || utils.auth.getUser(),
        profile = user.profile,
        sensitivityLevels = (profile && profile.sensitivity_levels) ? profile.sensitivity_levels : [],
        aqiScale = aqiScales ? aqiScales[aqiScales.findIndex(x => {
          return x.abbreviation === 'AUEPA';
        })]: null;

  var aqiThresholds = null;
  if (aqiScale) {
    var extraCheck = utils.aqiScaleTools.extraChecks(aqiScale.abbreviation), extended = true;
    aqiThresholds = utils.charts.parseScale(aqiScale, 'aqi', extraCheck, extended);
  }
  console.log(aqiThresholds)

  const notifications = (sites && profile) ? _prepareNotifications(sites, sensitivityLevels) : [];
  return {
    notifications: notifications,
    isFetchingData: isFetchingAqiScales && isFetchingSites,
    aqiThresholds
  };
};

export default connect(
  mapStateToProps,
  null
)(AQNotifications);
