// FireDetails.js

import React, { Component, Suspense } from 'react';
import { connect } from 'react-redux';
import {
  Badge,
  Button,
  Col,
  FormGroup,
  Input,
  Label,
  ListGroup,
  ListGroupItem,
  Row
} from 'reactstrap';
import Moment from 'react-moment';

import { updateQuery } from '../../actions';


class FireDetails extends Component {
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
        <h2>{selectedFire.properties.name || selectedFire.properties.sourceTitle || selectedFire.properties.category1}</h2>
        <p>{selectedFire.properties.location}</p>
        <Row>
          <Col xs="12" sm="12" lg="12">
            <ListGroup>
              <ListGroupItem className="justify-content-between">Categories <span className="float-right">{selectedFire.properties.category1}, {selectedFire.properties.category2}</span></ListGroupItem>
              <ListGroupItem className="justify-content-between">Feed Type <span className="float-right">{(selectedFire.properties.feedType === "warning")?<Badge color="warning" pill>{selectedFire.properties.feedType}</Badge>:<Badge color="danger" pill>{selectedFire.properties.feedType}</Badge> }</span></ListGroupItem>
              <ListGroupItem className="justify-content-between">Status <span className="float-right">{(selectedFire.properties.status === "Extreme")?<Badge color="danger" pill>{selectedFire.properties.status}</Badge>:<Badge color="warning" pill>{selectedFire.properties.status}</Badge> }</span></ListGroupItem>
              {selectedFire.properties.size || selectedFire.properties.sizeFmt ? 
              <ListGroupItem className="justify-content-between">Size <span className="float-right"><i class="fa fa-area-chart" ariaHidden="true"></i>&nbsp;{selectedFire.properties.size || selectedFire.properties.sizeFmt}</span></ListGroupItem>
              :''}
              {selectedFire.properties.resources ? 
              <ListGroupItem className="justify-content-between">Resources <span className="float-right"><i class="fa fa-bus" aria-hidden="true"></i>&nbsp;{selectedFire.properties.resources} vehicles responding.</span></ListGroupItem>
              :''}
              <ListGroupItem className="justify-content-between">Submitted on <span className="float-right"><i className="fa fa-clock-o" aria-hidden="true"></i>&nbsp;<Moment format="YYYY-MM-DD, HH:mm:SS">{ selectedFire.properties.created }</Moment></span></ListGroupItem>
              <ListGroupItem className="justify-content-between">Last Updated on <span className="float-right"><i className="fa fa-clock-o" aria-hidden="true">&nbsp;</i><Moment format="YYYY-MM-DD, HH:mm:SS">{ selectedFire.properties.updated }</Moment></span></ListGroupItem>
            </ListGroup>
          </Col>
        </Row>
        <hr/>
        <Row>
          <Col xs="12" sm="12" lg="12">
            {
              selectedFire.properties.webBody || selectedFire.properties.webHeadline
              ?
                <div dangerouslySetInnerHTML={{ __html: selectedFire.properties.webBody || selectedFire.properties.webHeadline }}></div>
              :
                <div>No extra information available.</div>
            }
          </Col>
        </Row>
      </Suspense>
    );
  }
};

export default FireDetails;