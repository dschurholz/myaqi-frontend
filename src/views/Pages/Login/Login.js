import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button, Card, CardBody, CardGroup, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row, FormFeedback } from 'reactstrap';

import { userActions } from '../../../actions';
import { utils } from '../../../utils';
import logo from '../../../assets/img/brand/newlogo-up.png'
import { localStore, sessionStore } from '../../../services';

const LogoStyles = {
  textAlign: 'center',
  marginBottom: '16px'
}

class Login extends Component {

  constructor(props) {
        super(props);

        // reset login status
        this.props.dispatch(userActions.logout());

        this.state = {
            username: '',
            password: '',
            submitted: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    handleSubmit(e) {
        e.preventDefault();

        this.setState({ submitted: true });
        const { username, password } = this.state;
        const { dispatch } = this.props;
        if (username && password) {
            dispatch(userActions.login(username, password));
        }
    }

  render() {
    const { loggingIn, error } = this.props;
    const { username, password, submitted } = this.state;

    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col style={LogoStyles} md="8">
              <img src={logo} height={100} alt="Logo"/>
            </Col>
          </Row>
          <Row className="justify-content-center">
            <Col md="8">
              <CardGroup>
                <Card className="p-4">
                  <CardBody>
                    <Form>
                      <h1>Login</h1>
                      <p className="text-muted">Sign In to your account</p>
                      <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-user"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input type="text" placeholder="Username" autoComplete="username" name="username" value={username} invalid={submitted && (!username || !!error)} onChange={this.handleChange}/>
                        {submitted && !username &&
                          <FormFeedback>Username is required...</FormFeedback>
                        }
                      </InputGroup>
                      <InputGroup className="mb-4">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-lock"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input type="password" placeholder="Password" name="password" autoComplete="current-password" value={password} invalid={submitted && (!password || !!error)} onChange={this.handleChange}/>
                        {submitted && !password &&
                          <FormFeedback>Password is required...</FormFeedback>
                        }
                        {!!error &&
                          <FormFeedback>{error}</FormFeedback>
                        }
                      </InputGroup>
                      <Row>
                        <Col xs="6">
                          <Button color="primary" className="px-4" onClick={this.handleSubmit} type="submit">Login</Button>
                          {
                            loggingIn && utils.loaders.StandardLoader()
                          }
                        </Col>
                        <Col xs="6" className="text-right">
                          <Button color="link" className="px-0" disabled={true}>Forgot password?</Button>
                        </Col>
                      </Row>
                    </Form>
                  </CardBody>
                </Card>
                <Card className="text-white bg-primary py-5 d-md-down-none" style={{ width: '44%' }}>
                  <CardBody className="text-center">
                    <div>
                      <h2>Sign up</h2>
                      <p>Get a free account on the MyAQI app and keep up to date with the Air Quality in your Region.</p>
                      <Link to="/register">
                        <Button color="primary" className="mt-3" active tabIndex={-1}>Register Now!</Button>
                      </Link>
                    </div>
                  </CardBody>
                </Card>
              </CardGroup>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { loggingIn, error } = state.authentication;
  return {
    loggingIn,
    error
  };
}

export default connect(
  mapStateToProps,
  null
)(Login);
