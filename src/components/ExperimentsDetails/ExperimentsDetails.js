// ExperimentsDetails.js

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

class ExperimentsDetails extends Component {
  loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>

  badgeColours = null;

  componentDidUpdate (prevProps) {
    const { setDate, selectedDate, aqiScale } = this.props;
    if (setDate && typeof setDate === 'function') setDate(selectedDate);

    if (aqiScale !== prevProps.aqiScale) {
      this.badgeColours = utils.aqiScaleTools.parseAqiScaleAllPollutantsStyles(aqiScale);
    }
  } 

  render () {
    const { extraData, timelineEntry, isFetchingData } = this.props;
    
    if(!timelineEntry  && isFetchingData) {
      return (
        <div>
           {utils.loaders.TableLoader({style: { height: '100px' }})}
        </div>
      );
    }
    if(!timelineEntry && !isFetchingData) {
      return (
        <div className="pl-4">
          Please select a date.
        </div>
      );
    }

    return (
      <Suspense fallback={this.loading()}>
        {/*<h5 style={{textAlign: 'center'}}>Date: <Moment format="YYYY-MM-DD HH">{ selectedDate }</Moment>h</h5>*/}
        <Row className="ml-0 mr-0">
          <Col className="pl-0 pr-0" xs="12" sm="12" lg="12">
            <ListGroup className="list-group-accent">
              <ListGroupItem className="list-group-item-accent-secondary bg-light text-center font-weight-bold text-muted text-uppercase small">Sites</ListGroupItem>
              {
                extraData.sites.map((site) => {
                  const measurements = timelineEntry.sites[site.site_id.toString()],
                        aqiValue = measurements.find((x) => Object.keys(x)[0] === 'AQI'),
                        aqiColor = aqiValue && this.badgeColours && Object.keys(this.badgeColours).includes('aqi') ? this.badgeColours['aqi'](aqiValue['AQI']) : null,
                        newStatusStyle = aqiColor ? Object.assign({}, STATUS_STYLE, { backgroundColor: aqiColor.bgColour, color: aqiColor.fgColour }) : STATUS_STYLE;
                  let isPollutant = true;
                  return (
                    <ListGroupItem key={site.site_id} action tag="a" className="list-group-item-accent-primary list-group-item-divider">
                      {
                        (aqiValue && aqiColor) ?
                          <div className="avatar float-right" style={newStatusStyle}>
                            { aqiColor.abbreviation }
                          </div>
                        : <></>
                      }
                      <div>{site.name} <strong>{site.site_id}</strong> </div>
                      {
                        (measurements.length > 0) ?
                          utils.aqiScaleTools.sortMeasurementsArray(measurements).map((measurement, idx) => {
                            const key = Object.keys(measurement)[0],
                                  color = this.badgeColours && Object.keys(this.badgeColours).includes(key.toLowerCase()) ? this.badgeColours[key.toLowerCase()](measurement[key]) : null;

                            if(isPollutant && utils.aqiScaleTools.WEATHER_VARIABLES.includes(key.toLowerCase())) {
                              isPollutant = false;
                              return (
                                <span key={key + idx} className="text-muted mr-3">
                                  <br/>
                                  <Badge color="primary">{key + ' ' + measurement[key]}</Badge>
                                </span>
                              )
                            } else {
                              return (
                                <span key={key + idx} className="text-muted mr-3">
                                  <Badge color="primary" style={color ? {backgroundColor: color.bgColour, color: color.fgColour } : {}}>{key + ' ' + measurement[key]}</Badge>
                                </span>
                              )
                            }
                          })
                        : <small className="text-muted">
                            No measurements for this date.
                          </small>
                      }
                    </ListGroupItem>    
                  );
                })
              }
            </ListGroup>
            <ListGroup className="list-group-accent">
              <ListGroupItem className="list-group-item-accent-secondary bg-light text-center font-weight-bold text-muted text-uppercase small">Traffic Stations</ListGroupItem>
              {
                extraData.traffic_stations.map((station) => {
                  const trafficVolume = timelineEntry.traffic_flows[station.station_id.toString()],
                        color = utils.trafficFlowTools.getPathColor(trafficVolume, station.quantiles),
                        newStatusStyle = Object.assign({}, STATUS_STYLE, { backgroundColor: color, color: '#000000' });
                  return (
                    <ListGroupItem key={station.station_id} action tag="a" className="list-group-item-accent-dark list-group-item-divider">
                      <div className="avatar float-right" style={newStatusStyle}>
                        {trafficVolume}
                      </div>
                      <div>{station.name} <strong>{station.station_id}</strong> </div>
                        <small className="text-muted">
                          Max volume:&nbsp; {station.max_volume}&nbsp; cars &nbsp;|&nbsp;
                        </small>
                        <small className="text-muted">
                          Average:&nbsp; {Math.round(station.avg_volume * 100) / 100}&nbsp; cars
                        </small>
                    </ListGroupItem>    
                  );
                })
              }
            </ListGroup>
            <ListGroup className="list-group-accent">
              <ListGroupItem className="list-group-item-accent-secondary bg-light text-center font-weight-bold text-muted text-uppercase small">Fires</ListGroupItem>
              {
                timelineEntry.fires.length > 0 ?
                  timelineEntry.fires.map((fire_id) => {
                    const fire = extraData.fires.find((e) => {return e.id === fire_id}),
                          fireStyles = Object.assign({}, STATUS_STYLE, {
                            color: ((fire.fire_svrty.startsWith("BURNT_5") || fire.fire_svrty.startsWith("BURNT_4"))?"danger":(fire.fire_svrty.startsWith("BURNT_3") || fire.fire_svrty.startsWith("BURNT_2"))?"warning":"primary"),
                          });

                    if (!!fire) {
                      return (
                        <ListGroupItem key={fire_id} action tag="a" className="list-group-item-accent-danger list-group-item-divider">
                          <div className="float-right">
                            <Badge color={fireStyles.color}>{fire.fire_svrty}</Badge>
                          </div>
                          <div>{fire.name} <strong>{Math.round(fire.area_ha * 100) / 100} Hectares</strong> </div>
                          <small className="text-muted">
                            Area:&nbsp; {fire.area_ha}&nbsp; Hectares
                          </small>
                          <br/>
                          <small className="text-muted">
                            Accuracy:&nbsp; {fire.accuracy}
                          </small>
                        </ListGroupItem>    
                      );
                    }
                    return <></>;
                  })
                : <p className="pt-2 text-center">No fires during this date.</p>
              }
            </ListGroup>
          </Col>
        </Row>
      </Suspense>
    );
  }
};

const mapStateToProps = state => {
  const { experimentsData, isFetchingExperimentsMapData } = state.experimentsMapData,
        { selectedExperimentsDate } = state,
        { aqiScales, isFetchingAqiScales } = state.aqiScales;

  return {
    selectedDate: selectedExperimentsDate,
    timelineEntry: experimentsData.timeline && selectedExperimentsDate ? experimentsData.timeline[selectedExperimentsDate] : null,
    extraData: {
      sites: experimentsData.sites,
      traffic_stations: experimentsData.traffic_stations,
      fires: experimentsData.fires
    },
    isFetchingData: isFetchingExperimentsMapData,
    aqiScale: aqiScales ? aqiScales[aqiScales.findIndex(x => {
      return x.abbreviation === 'AUEPA';
    })]: null,
    isFetchingAqiScales: isFetchingAqiScales
  };
};

export default connect(
  mapStateToProps,
  null
)(ExperimentsDetails);
