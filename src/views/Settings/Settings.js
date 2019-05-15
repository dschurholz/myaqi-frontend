import React, { Component } from 'react';
import { Button, Card, CardHeader, CardBody, Col, Form, FormGroup, Label, Input, Row } from 'reactstrap';

import { SettingsService } from '../../services';
import { utils } from '../../utils';
import darkGauge from '../../assets/img/brand/myAQIgauge-pure-dark.svg';
import lightGauge from '../../assets/img/brand/myAQIgauge-pure.svg';

const YES = 'Yes';
const NO = 'No';
const LIGHT = 'light';
const DARK = 'dark';


class Settings extends Component {
  constructor(props) {
    super(props);

    this.defaultSettings = {
      useTestData: NO,
      gaugeTheme: LIGHT
    };

    this.state = {
      settings: Object.assign({}, this.defaultSettings, SettingsService.getSettings() || {})
    };

    this.state.settings.useTestData = this.state.settings.useTestData ? YES : NO;

    this.handleChange = this.handleChange.bind(this);
    this.handleDefaultSettings = this.handleDefaultSettings.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const { name, value } = event.target;
    const { settings } = this.state;

    this.setState({
      settings: {
        ...settings,
        [name]: value,
      }
    });
  }

  handleDefaultSettings(event) {
    event.preventDefault();

    this.setState({
      settings: this.defaultSettings
    })
  }

  handleSubmit(event) {
    event.preventDefault();

    const { settings } = this.state;

    SettingsService.updateSettings(Object.assign({}, settings, {
      useTestData: settings.useTestData === YES
    }));

    console.log(utils.history)
    utils.history.goBack();
  }

  render() {
    const { settings } = this.state;

    return (
      <Row>
        <Col sm="12" md="6" lg="6" xl="6">
          <Card className="mx-4">
            <CardHeader>
              <strong>Settings</strong>
            </CardHeader>
            <CardBody className="p-4">
              <Form>
                <p className="text-muted">App Settings</p>
                <FormGroup row>
                  <Col md="6">
                    <Label>Use Test Data</Label>
                  </Col>
                  <Col md="6">
                    <FormGroup inline check className="radio">
                      <Input className="form-check-input" type="radio" id="radioYes" name="useTestData" value={YES} onChange={this.handleChange} checked={settings.useTestData === YES}/>
                      <Label check className="form-check-label" htmlFor="radioYes">{YES}</Label>
                    </FormGroup>
                    <FormGroup inline check className="radio">
                      <Input className="form-check-input" type="radio" id="radioNo" name="useTestData" value={NO} checked={settings.useTestData === NO} onChange={this.handleChange}/>
                      <Label check className="form-check-label" htmlFor="radioNo">{NO}</Label>
                    </FormGroup>
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Col md="6">
                    <Label>Gauge Theme</Label>
                  </Col>
                  <Col md="6">
                    <FormGroup inline check className="radio">
                      <Input className="form-check-input" type="radio" id="radioLight" name="gaugeTheme" value={LIGHT} onChange={this.handleChange} checked={settings.gaugeTheme === LIGHT}/>
                      <Label check className="form-check-label" htmlFor="radioLight">Light&nbsp;<img src={lightGauge} height="25" alt="Light color" /></Label>
                    </FormGroup>
                    <FormGroup inline check className="radio">
                      <Input className="form-check-input" type="radio" id="radioDark" name="gaugeTheme" value={DARK} checked={settings.gaugeTheme === DARK} onChange={this.handleChange}/>
                      <Label check className="form-check-label" htmlFor="radioDark">Dark&nbsp;<img src={darkGauge} height="25" alt="Dark color" /></Label>
                    </FormGroup>
                  </Col>
                </FormGroup>
                <Button color="primary" onClick={this.handleSubmit} block>Update Settings</Button>
                <hr />
                <Button color="danger" onClick={this.handleDefaultSettings} block>Default Settings</Button>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    );
  }
}

export default Settings;
