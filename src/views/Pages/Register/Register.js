import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Card, CardBody, CardFooter, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row, FormFeedback } from 'reactstrap';

import { userActions } from '../../../actions';
import { utils } from '../../../utils';

class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {
        firstName: '',
        lastName: '',
        email: '',
        username: '',
        password: ''
      },
      submitted: false,
      passwordCheck: '',
      passwordValid: true
    };

    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const { name, value } = event.target;
    const { user, passwordCheck } = this.state;
    this.setState({
      user: {
        ...user,
        [name]: value,
      },
      passwordValid: user.password === passwordCheck
    });
  }

  handlePasswordChange(event) {
    const { name, value } = event.target;
    const { user } = this.state;

    this.setState({
      [name]: value,
      passwordValid: user.password === value,
    });
  }

  handleSubmit(event) {
    event.preventDefault();

    this.setState({ submitted: true });
    const { user, passwordValid } = this.state;
    const { dispatch } = this.props;
    if (user.email && user.username && user.password && passwordValid) {
      dispatch(userActions.register(utils.tools.camelCameToUnderscore(user)));
    }
  }

  onCancel(event) {
    event.preventDefault();

    utils.history.push('/login');
  }

  render() {
    const { registering } = this.props;
    const {user, submitted, passwordCheck, passwordValid} = this.state;
    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="9" lg="7" xl="6">
              <Card className="mx-4">
                <CardBody className="p-4">
                  <Form>
                    <h1>Register</h1>
                    <p className="text-muted">Create your account</p>
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-user"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="text" placeholder="Username" autoComplete="username" name="username" value={user.username} invalid={submitted && !user.username} onChange={this.handleChange}/>
                      {
                        submitted && !user.username &&
                          <FormFeedback>Username is required...</FormFeedback>
                      }
                    </InputGroup>
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>@</InputGroupText>
                      </InputGroupAddon>
                      <Input type="text" placeholder="Email" autoComplete="email" name="email" value={user.email} invalid={submitted && !user.email} onChange={this.handleChange}/>
                      {
                        submitted && !user.email &&
                          <FormFeedback>Email is required...</FormFeedback>
                      }
                    </InputGroup>
                    <InputGroup className="mb-3">
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
                    </InputGroup>
                    <InputGroup className="mb-0">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-user"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="text" placeholder="First Name" autoComplete="first-name" name="firstName" value={user.firstName} onChange={this.handleChange}/>
                    </InputGroup>
                    <p className="help-block mb-2" style={{ fontSize: '80%' }}>* Optional</p>
                    <InputGroup className="mb-0">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-user"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="text" placeholder="Last Name" autoComplete="last-name" name="lastName" value={user.lastName} onChange={this.handleChange}/>
                    </InputGroup>
                    <p className="help-block mb-4" style={{ fontSize: '80%' }}>* Optional</p>
                    <Button color="success" onClick={this.handleSubmit} block>Create Account</Button>
                    <Button color="secondary" onClick={this.onCancel} block>Cancel</Button>
                    {
                      registering && utils.loaders.StandardLoader()
                    }
                  </Form>
                </CardBody>
                {/*<CardFooter className="p-4">
                  <Row>
                    <Col xs="12" sm="6">
                      <Button className="btn-facebook mb-1" block><span>facebook</span></Button>
                    </Col>
                    <Col xs="12" sm="6">
                      <Button className="btn-twitter mb-1" block><span>twitter</span></Button>
                    </Col>
                  </Row>
                </CardFooter>*/}
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}
function mapStateToProps(state) {
    const { registering } = state.registration;
    return {
        registering
    };
}

export default connect(
  mapStateToProps,
  null
)(Register);
