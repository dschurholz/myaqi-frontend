import React, { Component } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Row
} from 'reactstrap';
import Moment from 'react-moment';
import { MainMap, ExperimentsDateSelector, ExperimentsDetails } from '../../components';
import { store } from '../../stores';
import { getExperimentsMapData, getAQIScales } from '../../actions';


class Dashboard extends Component {
  loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>

  constructor(props) {
    super(props);

    this.state = {
      date: ''
    };

    this.setDate.bind(this);
  }

  componentDidMount() {
    store.dispatch(getExperimentsMapData());    
    store.dispatch(getAQIScales());
  }

  setDate = (newDate) => {
    this.setState({
      date: newDate
    });
  }

  render() {

    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs="12" sm="6" lg="6">
            <Card className="text-black map-card">
              <CardHeader>
                <i className="fa fa-align-justify"></i> Experiments Map
              </CardHeader>
              <CardBody className="pb-0">
                <MainMap scaleMarkers={[40, 40]} loaderHeight="300px" loaderMargin="150px" />
              </CardBody>
            </Card>
          </Col>
          <Col xs="12" sm="6" lg="6">
            <Card className="text-black site-list-card">
              <CardHeader>
                <i className="fa fa-align-justify"></i> Details
                {
                  (!!this.state.date) ?
                    <strong className="float-right">
                      <i>for</i>&nbsp;<Moment format="YYYY-MM-DD HH">{ this.state.date }</Moment>h
                    </strong>
                  : <></>
                }
              </CardHeader>
              <CardBody className="pt-0 pb-0 pl-0 pr-0">
                <ExperimentsDetails setDate={this.setDate}/>
              </CardBody>
            </Card>
          </Col>
         </Row>
         <Row>
          <Col xs="12" sm="12" lg="12">
            <Card className="text-black map-card">
              <CardHeader>
                <i className="fa fa-calendar"></i> Date Range
                {
                  (!!this.state.date) ?
                    <strong className="float-right">
                      <i>current</i>&nbsp;<Moment format="YYYY-MM-DD HH">{ this.state.date }</Moment>h
                    </strong>
                  : <></>
                }
              </CardHeader>
              <CardBody className="pb-0 pt-1">
                <ExperimentsDateSelector value={0}/>
              </CardBody>
            </Card>
          </Col>
         </Row>
      </div>
    );
  }
}

export default Dashboard;
