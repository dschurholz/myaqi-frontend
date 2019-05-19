import React, { Component } from 'react';
import { connect } from 'react-redux';
import { 
  Badge,
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Col,
  Form,
  FormText,
  FormGroup,
  Label,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row,
  FormFeedback,
  Collapse,
  ListGroup,
  ListGroupItem } from 'reactstrap';
import Moment from 'react-moment';
import { AppSwitch } from '@coreui/react'

import { store } from '../../stores';
import { userActions } from '../../actions';
import { utils } from '../../utils';
import { Questionnaire, PreviewMap, AQIScaleTable } from '../../components';
import { getAQIScales } from '../../actions';

const YES = 'Yes';
const NO = 'No';
const AU_EPA_AQI = 'AUEPA';


class Profile extends Component {
  constructor(props) {
    super(props);

    const user = props.user;
    this.state = {
      user: {
        username: user.username,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name
      },
      profile: {
        colourBlindness: user.profile && !!user.profile.colour_blindness?YES:NO,
        age: (user.profile && user.profile.age) || 18,
        aqiScale: (user.profile && user.profile.aqi_scale) || AU_EPA_AQI,
        questionnaireAnswers: []
      },
      submitted: false,
      collapse: {
        questionnaire: false,
        pollutantSensitivity: false,
        mapsAndIcons: true,
        AQIScales: false
      },
      visualization: {
        gauges: true,
        heatmap: false,
        pinsText: false,
        pins: false,
        hotspots: false
      },
      questionnaire: {
        numQuestions: 0
      }
    };

    this.handleProfileChange = this.handleProfileChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.openCollapse = this.openCollapse.bind(this);
    this.handleQuestionnaireInit = this.handleQuestionnaireInit.bind(this);
    this.handleQuestionnaireChange = this.handleQuestionnaireChange.bind(this);
  }

  componentDidMount() {
    store.dispatch(getAQIScales());   
  }

  handleChange(event) {
    const { name, value } = event.target;
    const { user } = this.state;

    this.setState({
      user: {
        ...user,
        [name]: value,
      }
    });
  }

  handleProfileChange(event) {
    const { name, value } = event.target;
    const { profile } = this.state;

    this.setState({
      profile: {
        ...profile,
        [name]: value,
      }
    });
  }

  handleQuestionnaireChange(event, updatedAnswers) {
    event.preventDefault();

    const { profile } = this.state;

    this.setState({
      profile: {
        ...profile,
        questionnaireAnswers: updatedAnswers,
      }
    });
  }

  handleDelete(event) {
    event.preventDefault();

    const { dispatch } = this.props;
    if(window.confirm("Are you sure you want to remove your account? (This action can't be undone)")) {
      dispatch(userActions.delete());
    }
  }

  handleSubmit(event) {
    event.preventDefault();

    this.setState({ submitted: true });
    const { user, profile } = this.state;
    const { dispatch } = this.props;
    if (user.email) {
      let cleanUser = {};
      Object.assign(cleanUser, user);
      cleanUser.profile = {};
      Object.assign(cleanUser.profile, profile);
      cleanUser.profile.colourBlindness = profile.colourBlindness === YES;
      cleanUser.profile.questionnaireAnswers = [];
      for (let a in profile.questionnaireAnswers) {
        cleanUser.profile.questionnaireAnswers.push({
          question_id: parseInt(a),
          answer_id: profile.questionnaireAnswers[a]
        });
      }
      dispatch(userActions.updateProfile(
        utils.tools.camelCameToUnderscore(cleanUser)));
    }
  }

  openCollapse(event) {
    event.preventDefault();

    const { target } = event.target;
    const { collapse } = this.state;
    this.setState({
      collapse: {
        ...collapse,
        [target]: !collapse[target]
      }
    });
  }

  formatPollutant(pollutantName) {
    const regexStr = pollutantName.match(/[a-z]+|[^a-z]+/g);
    return (
      <>
        {regexStr[0].toUpperCase()}
        {(regexStr.length > 0)? <sub>{regexStr[1]}</sub>: ''}
      </>
    );
  }

  handleSwitchChange = e => {
    const { name } = e.target;
    const { visualization } = this.state;
    var newVis = {};

    for (var v in visualization) {
      newVis[v] = false;
    }
    newVis[name] = true;

    this.setState({
      visualization: newVis
    });
  };

  handleQuestionnaireInit (numQuestions) {
    this.setState({
      questionnaire: {
        numQuestions: numQuestions
      }
    });
  }

  render() {
    const { updating, aqiScales } = this.props;
    const { user, profile, submitted, collapse, visualization, questionnaire } = this.state;
    const modified = (this.props.user.profile && this.props.user.profile.modified) || 'new';
    const questionnaireAnswers = this.props.user.profile && this.props.user.profile.questionnaire_answers,
      sensitivityLevels = this.props.user.profile && this.props.user.profile.sensitivity_levels;

    return (
      <Row>
        <Col sm="12" md="6" lg="6" xl="6">
          <Card className="mx-4">
            <CardHeader>
              <strong>Profile</strong>
            </CardHeader>
            <CardBody className="p-4">
              <Form>
                <p className="text-muted">Context Settings</p>
                <FormGroup row>
                  <Col md="3">
                    <Label htmlFor="text-input">Age</Label>
                  </Col>
                  <Col xs="12" md="9">
                    <InputGroup>
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-calendar"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="number" step="1" placeholder="Age" autoComplete="age" name="age" value={profile.age} invalid={submitted && !profile.age} onChange={this.handleProfileChange}/>
                      {
                        submitted && !profile.age &&
                          <FormFeedback>Age is required...</FormFeedback>
                      }
                    </InputGroup>
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Col md="3">
                    <Label>Colour Blindness</Label>
                  </Col>
                  <Col md="9">
                    <FormGroup inline check className="radio">
                      <Input className="form-check-input" type="radio" id="radioYes" name="colourBlindness" value={YES} onChange={this.handleProfileChange} checked={profile.colourBlindness === YES}/>
                      <Label check className="form-check-label" htmlFor="radioYes">{YES}</Label>
                    </FormGroup>
                    <FormGroup inline check className="radio">
                      <Input className="form-check-input" type="radio" id="radioNo" name="colourBlindness" value={NO} checked={profile.colourBlindness === NO} onChange={this.handleProfileChange}/>
                      <Label check className="form-check-label" htmlFor="radioNo">{NO}</Label>
                    </FormGroup>
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Col md="3">
                    <Label htmlFor="monitorSelect">Preferred AQI Scale</Label>
                  </Col>
                  <Col xs="12" md="9" size="lg">
                    <Input type="select" name="aqiScale" id="aqiScaleSelect" value={profile.aqiScale} onChange={ this.handleProfileChange }>
                      {aqiScales.map(scale => {
                        return (
                          <option key={scale.abbreviation} value={scale.abbreviation}>{scale.name}</option>
                        );
                      })}
                    </Input>
                  </Col>
                </FormGroup>
                <FormText color="muted">
                  Last modified: &nbsp;
                  { modified !== 'new' ?
                    <Moment parse="YYYY-MM-DDTHH:mm:SS" format="YYYY-MM-DD HH:mm">
                      { modified }
                    </Moment>
                    :
                    <>
                      { modified }
                    </>
                  }
                </FormText>
                <hr />
                <p className="text-muted">AQI Sensitivity Questionnaire</p>
                {
                  !!this.props.user ?
                    <>
                      <FormText className={!collapse.questionnaire ? 'mb-0' : 'mb-2'}>
                        <a href="questionnaire" target="questionnaire" onClick={this.openCollapse}>
                        {
                          !collapse.questionnaire ?
                            (!sensitivityLevels || sensitivityLevels.length === 0) ?
                              `Take this questionnaire to assess your sensitivity towards certain pollutants.`
                            : (questionnaireAnswers && questionnaireAnswers.length !== questionnaire.numQuestions)?
                              `Complete your answers. (${questionnaireAnswers.length}/${questionnaire.numQuestions})` :
                              `Review your answers.`
                          :
                            `Close questionnaire.`
                        }
                        </a>
                      </FormText>
                      <Collapse isOpen={collapse.questionnaire} style={{maxHeight: '300px', overflowY: 'scroll', overflowX: 'hidden'}}>
                          <Questionnaire onInit={this.handleQuestionnaireInit} onChange={this.handleQuestionnaireChange} answers={questionnaireAnswers || []}/>
                      </Collapse>
                    </>
                  :
                  utils.loaders.StandardLoader()
                }
                <hr />
                <p className="text-muted">User Data</p>
                <FormGroup row>
                  <Col md="3">
                    <Label>Username</Label>
                  </Col>
                  <Col xs="12" md="9">
                    <p className="form-control-static mb-0" style={{fontStyle: 'italic'}}>{user.username}</p>
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Col md="3">
                    <Label htmlFor="text-input">Email</Label>
                  </Col>
                  <Col xs="12" md="9">
                    <InputGroup>
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>@</InputGroupText>
                      </InputGroupAddon>
                      <Input type="text" placeholder="Email" autoComplete="email" name="email" value={user.email} invalid={submitted && !user.email} onChange={this.handleChange}/>
                      {
                        submitted && !user.email &&
                          <FormFeedback>Email is required...</FormFeedback>
                      }
                    </InputGroup>
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Col md="3">
                    <Label htmlFor="text-input">First Name</Label>
                  </Col>
                  <Col xs="12" md="9">
                    <InputGroup>
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-user"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="text" placeholder="First Name" autoComplete="first-name" name="firstName" value={user.firstName} onChange={this.handleChange}/>
                    </InputGroup>
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Col md="3">
                    <Label htmlFor="text-input">Last Name</Label>
                  </Col>
                  <Col xs="12" md="9">
                    <InputGroup>
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-user"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="text" placeholder="Last Name" autoComplete="last-name" name="lastName" value={user.lastName} onChange={this.handleChange}/>
                    </InputGroup>
                  </Col>
                </FormGroup>
                <Button color="primary" onClick={this.handleSubmit} block>Update Profile</Button>
                {
                  updating && 
                  utils.loaders.StandardLoader()
                }
                <hr />
                <Button color="danger" onClick={this.handleDelete} block>Delete Account</Button>
              </Form>
            </CardBody>
          </Card>
        </Col>
        <Col sm="12" md="6" lg="6" xl="6">
          <Card className="mx-4">
            <CardHeader>
              <strong>Pollutant Sensitivity</strong>&nbsp;<i>Preview</i>
            </CardHeader>
            <Collapse isOpen={collapse.pollutantSensitivity}>
              <CardBody className="p-4">
                {
                  sensitivityLevels && sensitivityLevels.length > 0 ?
                  <ListGroup>
                    {
                      sensitivityLevels.map(level => {
                        return (
                          <ListGroupItem key={level.pollutant_id} className="justify-content-between">{this.formatPollutant(level.pollutant_id)} <span className="float-right"><Badge color={level.level === 0?'success':(level.level === 1?'info':(level.level === 2?'warning':(level.level === 3?'danger':'dark')))} pill>{level.level_display}</Badge></span></ListGroupItem>
                        );
                      })
                    }
                  </ListGroup>
                  : 
                  <div>Fill in the questionnaire to see your pollutant sensitivity levels.</div>
                }
              </CardBody>
            </Collapse>
            <CardFooter>
              <a href="pollutant-sensitivity" onClick={this.openCollapse} className={'btn btn-primary mb-1'} id="pollutantSensitivityToggle" target="pollutantSensitivity">{!collapse.pollutantSensitivity?'Show':'Hide'}</a>
            </CardFooter>
          </Card>
          <Card className="mx-4">
            <CardHeader className="header-with-switches">
              <strong>Maps & Icons</strong>&nbsp;<i>Preview</i>
              <div className="float-right header-switch">
                <span className="header-switch-label">Hotspots</span>
                <AppSwitch size="sm" className={'header-switch mx-1'} color={'primary'} checked={visualization.hotspots} onChange={ this.handleSwitchChange } name="hotspots" value="hotspots"/>
              </div>
              <div className="float-right header-switch mr-1">
                <span className="header-switch-label">Heatmap</span>
                <AppSwitch size="sm" className={'header-switch mx-1'} color={'primary'} checked={visualization.heatmap} onChange={ this.handleSwitchChange } name="heatmap" value="heatmap"/>
              </div>
              <div className="float-right header-switch mr-1">
                <span className="header-switch-label">Pins</span>
                <AppSwitch size="sm" className={'header-switch mx-1'} color={'primary'} checked={visualization.pins} onChange={ this.handleSwitchChange } name="pins" value="pins"/>
              </div>
              <div className="float-right header-switch mr-1">
                <span className="header-switch-label">Pins + text</span>
                <AppSwitch size="sm" className={'header-switch mx-1'} color={'primary'} checked={visualization.pinsText} onChange={ this.handleSwitchChange } name="pinsText" value="pinsText"/>
              </div>
              <div className="float-right header-switch mr-1">
                <span className="header-switch-label">Gauges</span>
                <AppSwitch size="sm" className={'header-switch mx-1'} color={'primary'} checked={visualization.gauges} onChange={ this.handleSwitchChange } name="gauges" value="gauges"/>
              </div>
            </CardHeader>
            <Collapse isOpen={collapse.mapsAndIcons}>
              <CardBody className="p-0">
                <PreviewMap scaleMarkers={visualization.gauges ? [60, 60] : null} visualization={visualization} loaderHeight="300px" loaderMargin="150px" emptyText="AQI scale info couldn't be retrieved."/>
              </CardBody>
            </Collapse>
            <CardFooter>
              <a href="pollutant-sensitivity-map" onClick={this.openCollapse} className={'btn btn-primary mb-1'} id="pollutantSensitivityMapToggle" target="mapsAndIcons">{!collapse.mapsAndIcons?'Show':'Hide'}</a>
            </CardFooter>
          </Card>
          <Card className="mx-4">
            <CardHeader>
              <strong>AQI Scale</strong>&nbsp;<i>Preview</i>
            </CardHeader>
            <Collapse isOpen={collapse.AQIScales}>
              <CardBody className="p-0">
                <AQIScaleTable />
              </CardBody>
            </Collapse>
            <CardFooter>
              <a href="aqi-scale" onClick={this.openCollapse} className={'btn btn-primary mb-1'} id="aqiScaleToggle" target="AQIScales">{!collapse.AQIScales?'Show':'Hide'}</a>
            </CardFooter>
          </Card>
        </Col>
      </Row>
    );
  }
}

function mapStateToProps(state) {
    const { currentUser } = state,
          { updating, deleting } = currentUser,
          { aqiScales, isFetchingAqiScales } = state.aqiScales,
          user = currentUser.user || utils.auth.getUser();

    return {
        updating,
        deleting,
        isFetchingAqiScales,
        aqiScales,
        user
    };
}

export default connect(
  mapStateToProps,
  null
)(Profile);
