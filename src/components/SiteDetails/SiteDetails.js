// SiteDetails.js

// eslint-disable-next-line
import React, { Component, Suspense } from 'react';
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
import * as moment from 'moment';

class SiteDetails extends Component {
  loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>
  
  state = {
    monitor: "",
    monitor_time_basis: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    monitorTimeBasis: []
  };

  handleInputChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });

    if (e.target.name === 'monitor' && e.target.value !== '') {
      let idx = this.props.selectedSite.monitors.findIndex(obj => {return obj.monitor_id === e.target.value });
      this.setState({
        monitorTimeBasis: this.props.selectedSite.monitors[idx].monitor_time_basis
      });
    }
  };

  handleSubmit = e => {
    e.preventDefault();

    if (this.state.monitor && this.state.startDate && this.state.endDate) {
      let params = {
        siteId: this.props.selectedSite.site_id,
        monitorId: this.state.monitor,
        timebasisid: (this.state.monitor_time_basis) ? this.state.monitor_time_basis: '1HR_AV',
        fromDate: this.state.startDate.replace(/-/g, '') + (this.state.startTime ? this.state.startTime.substr(0, 2): '00'),
        toDate: this.state.endDate.replace(/-/g, '') + (this.state.endTime ? this.state.endTime.substr(0, 2): '00')
      };
      this.props.onUpdateTable(params);
    } else {
      alert("Please select all the values from the form.");
    }
  };

  fillDates = e => {
    e.preventDefault();

    let now = moment(), fiveDaysAgo = moment().subtract(5, 'days');
    this.setState({
      endDate: now.format('YYYY-MM-DD'),
      endTime: now.format('HH:mm'),
      startDate: fiveDaysAgo.format('YYYY-MM-DD'),
      startTime: fiveDaysAgo.format('HH:mm')
    });
  };

  render () {
    if(!this.props.selectedSite || !this.props.selectedSite.monitors) {
      return (
        <div>
          No site selected.
        </div>
      );
    }

    return (
      <div className="">
        <Suspense fallback={this.loading()}>
          <h2>{this.props.selectedSite.name}</h2>
          <Row>
            <Col xs="12" sm="12" lg="12">
              <ListGroup>
                <ListGroupItem className="justify-content-between">Id <span className="float-right">{this.props.selectedSite.site_id}</span></ListGroupItem>
                <ListGroupItem className="justify-content-between">Status <span className="float-right">{(this.props.selectedSite.is_station_offline)?<Badge color="danger" pill>Offline</Badge>:<Badge color="success" pill>Online</Badge> }</span></ListGroupItem>
                <ListGroupItem className="justify-content-between">Region <span className="float-right">{(this.props.selectedSite.site_list && this.props.selectedSite.site_list.length > 0)?this.props.selectedSite.site_list[0].name:'-'}</span></ListGroupItem>
                { 
                  this.props.selectedSite.fire_hazard_category ?
                  <ListGroupItem className="justify-content-between">Fire hazard category <span className="float-right">{this.props.selectedSite.fire_hazard_category}</span></ListGroupItem> :
                  <></>
                }
                <ListGroupItem className="justify-content-between">Has Incident <span className="float-right">{ (this.props.selectedSite.has_incident)?<Badge color="danger" pill>Yes</Badge>:<Badge color="success" pill>No</Badge> }</span></ListGroupItem>
              </ListGroup>
            </Col>
          </Row>
          <hr/>
          <Row>
            <Col xs="12" sm="12" lg="12">
              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="monitorSelect">Monitor (Parameter)</Label>
                </Col>
                <Col xs="12" md="9" size="lg">
                  <Input type="select" name="monitor" id="monitorSelect" bsSize="lg" onChange={ this.handleInputChange }>
                    <option value="">Please select</option>
                    {this.props.selectedSite.monitors.map(monitor => {
                      return (
                        <option key={monitor.monitor_id} value={monitor.monitor_id}>{monitor.common_name}</option>
                      );
                    })}
                  </Input>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="monitorTimeBasisSelect">Time Basis</Label>
                </Col>
                <Col xs="12" md="9" size="lg">
                  <Input type="select" name="monitor_time_basis" id="monitorTimeBasisSelect" bsSize="lg" onChange={ this.handleInputChange }>
                    <option value="">Please select</option>
                    {this.state.monitorTimeBasis.map(time_basis => {
                      return (
                        <option key={time_basis.time_basis.time_base_id} value={time_basis.time_basis.time_base_id}>{time_basis.time_basis.time_base_id}</option>
                      );
                    })}
                  </Input>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Col md="4">
                  <Label htmlFor="startDate">Start Date and Time</Label>
                </Col>
                <Col xs="5" md="4">
                  <Input type="date" id="startDate" name="startDate" placeholder="date" onChange={ this.handleInputChange } value={this.state.startDate}/>
                </Col>
                <Col xs="6" md="4">
                  <Input type="time" id="startTime" name="startTime" placeholder="date" step="3600" onChange={ this.handleInputChange } value={this.state.startTime}/>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Col md="4">
                  <Label htmlFor="endDate">End Date and Time</Label>
                </Col>
                <Col xs="6" md="4">
                  <Input type="date" id="endDate" name="endDate" placeholder="date" onChange={ this.handleInputChange } value={this.state.endDate}/>
                </Col>
                <Col xs="6" md="4">
                  <Input type="time" id="endTime" name="endTime" placeholder="date" step="3600" onChange={ this.handleInputChange } value={this.state.endTime}/>
                </Col>
              </FormGroup>
              <div style={{textAlign: 'right'}}>
                <a href="#" onClick={ this.fillDates }>Past 5 Days</a>
              </div>
              <FormGroup className="form-actions" style={{textAlign: 'center'}}>
                <Button type="submit" color="primary" size="lg" onClick={ this.handleSubmit }>Update Measurements Table</Button>
              </FormGroup>
            </Col>
          </Row>
        </Suspense>
      </div>
    );
  }
};

export default SiteDetails;