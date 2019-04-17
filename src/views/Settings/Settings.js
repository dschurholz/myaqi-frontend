import React, { Component } from 'react';
import { Button, Card, CardHeader, CardBody, Col, Form, FormText, FormGroup, Label, Input, Row } from 'reactstrap';

import { SettingsService } from '../../services';

const YES = 'Yes';
const NO = 'No';
const AU_EPA_AQI = 'AUEPA';


class Settings extends Component {
  constructor(props) {
    super(props);

    this.defaultSettings = {
      useTestData: NO
    };

    this.state = {
      settings: SettingsService.getSettings() || this.defaultSettings
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
