import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Card, CardHeader, CardBody, CardFooter, Col, Container, Form, FormText, FormGroup, Label, Input, InputGroup, InputGroupAddon, InputGroupText, Row, FormFeedback } from 'reactstrap';
import Moment from 'react-moment';

import { userActions } from '../../actions';
import { utils } from '../../utils';

const YES = 'Yes';
const NO = 'No';
const AU_EPA_AQI = 'AUEPA';
const EU_EEA_AQI = 'EUEEA';
const USA_EPA_AQI = 'USEPA';
const AQI_SCALES = [
    {key: AU_EPA_AQI, text: 'Australian EPA AQI'},
    {key: EU_EEA_AQI, text: 'EU EEA AQI'},
    {key: USA_EPA_AQI, text: 'USA EPA AQI'}
];


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
        aqiScale: (user.profile && user.profile.aqi_scale) || AU_EPA_AQI
      },
      submitted: false
    };

    this.handleProfileChange = this.handleProfileChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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

  handleDelete(event) {
    event.preventDefault();

    const { dispatch } = this.props;
    if(window.confirm("Are you sure you want to remove your account? (This action can't be undone)")) {
      dispatch(userActions.userActions.delete());
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
      dispatch(userActions.userActions.updateProfile(
        utils.tools.camelCameToUnderscore(cleanUser)));
    }
  }

  onCancel(event) {
    event.preventDefault();

    utils.history.push('/login');
  }

  render() {
    const { updating } = this.props;
    const {user, profile, submitted } = this.state;
    const modified = (this.props.user.profile && this.props.user.profile.modified) || 'new';

    return (
      <Row className="justify-content-center">
        <Col md="9" lg="7" xl="6">
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
                    <Label>Colour Blindess</Label>
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
                      {AQI_SCALES.map(scale => {
                        return (
                          <option key={scale.key} value={scale.key}>{scale.text}</option>
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
                {/*<InputGroup className="mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="icon-lock"></i>
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input type="password" placeholder="Password" autoComplete="new-password" name="password" value={user.password} invalid={submitted && !user.password} onChange={this.handleChange}/>
                  {
                    submitted && !user.password &&
                      <FormFeedback>Password is required...</FormFeedback>
                  }
                </InputGroup>
                <InputGroup className="mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="icon-lock"></i>
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input type="password" placeholder="Repeat password" autoComplete="new-password" name="passwordCheck" value={passwordCheck} invalid={!!passwordCheck && !passwordValid} valid={!!passwordCheck && passwordValid} onChange={this.handlePasswordChange}/>
                </InputGroup>*/}
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
                  <img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                }
                <hr />
                <Button color="danger" onClick={this.handleDelete} block>Delete Account</Button>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    );
  }
}
function mapStateToProps(state) {
    const { updating, user, deleting } = state.currentUser;
    return {
        updating,
        deleting,
        user: user || utils.auth.getUser()
    };
}

export default connect(
  mapStateToProps,
  null
)(Profile);
