// HistoricalFireDetails.js

import React, { Component, Suspense } from 'react';
import { connect } from 'react-redux';
import {
  Badge,
  Col,
  ListGroup,
  ListGroupItem,
  Row
} from 'reactstrap';
import Moment from 'react-moment';

class HistoricalFireDetails extends Component {
  loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>

  render () {
    const { selectedFire } = this.props; 
    if(!selectedFire) {
      return (
        <div>
          No incident selected.
        </div>
      );
    }
    return (
      <Suspense fallback={this.loading()}>
        <h2>{selectedFire.name}</h2>
        <p>{selectedFire.season} - {selectedFire.districtid || 'District Unknown'}</p>
        <Row>
          <Col xs="12" sm="12" lg="12">
            <ListGroup>
              <ListGroupItem className="justify-content-between">Start Date <span className="float-right"><Moment format="YYYY-MM-DD">{ selectedFire.start_date }</Moment> {selectedFire.start_date}</span></ListGroupItem>
              <ListGroupItem className="justify-content-between">Type <span className="float-right">{selectedFire.firetype}</span></ListGroupItem>
              <ListGroupItem className="justify-content-between">Severity <span className="float-right"><Badge color={(selectedFire.fire_svrty.startsWith("BURNT_5") || selectedFire.fire_svrty.startsWith("BURNT_4") || selectedFire.fire_svrty.endsWith("FOREST"))?"danger":(selectedFire.fire_svrty.startsWith("BURNT_3") || selectedFire.fire_svrty.startsWith("BURNT_2"))?"warning":"primary"} pill>{selectedFire.fire_svrty}</Badge></span></ListGroupItem>
              <ListGroupItem className="justify-content-between">Area <span className="float-right">{Math.round(selectedFire.area_ha * 100) / 100} Hectares</span></ListGroupItem>
              <ListGroupItem className="justify-content-between">Treatment Type <span className="float-right">{selectedFire.treat_type}</span></ListGroupItem>
              <ListGroupItem className="justify-content-between">Observation Method <span className="float-right">{selectedFire.method}</span></ListGroupItem>
              <ListGroupItem className="justify-content-between">Accuracy <span className="float-right">{selectedFire.accuracy}</span></ListGroupItem>
            </ListGroup>
          </Col>
        </Row>
      </Suspense>
    );
  }
};

const mapStateToProps = state => {
  return {
    selectedFire: state.selectedHistoricFire
  };
};

export default connect(
  mapStateToProps,
  null
)(HistoricalFireDetails);
