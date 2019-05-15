// AQIScaleTable.js

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Table, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import { utils } from '../../utils';

class AQIScaleTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeTab: 'aqi',
    }

    this.toggle = this.toggle.bind(this);
  }

  toggle(tab) {
    this.setState({
      activeTab: tab
    });
  }

  render () {
    const { aqiScale, isFetchingData } = this.props;
    const { activeTab } = this.state;

    if(!aqiScale && !isFetchingData) {
      return (
        <div>
          No scale selected or found.
        </div>
      )
    }
    if(!aqiScale && isFetchingData) {
      return (
        <div>
          <utils.loaders.TableLoader />
        </div>
      )
    }
    const aqiThresholds = utils.aqiScaleTools.parseScaleAllPollutants(aqiScale),
          pollutants = utils.aqiScaleTools.sortPollutantsArray(Object.keys(aqiThresholds));

    return (
      <React.Fragment>
        <Nav tabs>
            { pollutants.map(pollutant => {
                return (
                  <NavItem key={pollutant}>
                    <NavLink
                      active={activeTab === pollutant}
                      onClick={() => { this.toggle(pollutant); }}
                    >
                      { pollutant.replace('_', ' ').toUpperCase() }
                    </NavLink>
                  </NavItem>
                )
              })
            }
        </Nav>
        <TabContent activeTab={activeTab}>
          { pollutants.map(pollutant => {
              return (
                <TabPane tabId={pollutant} key={pollutant}>
                  <Table responsive>
                    <caption className="ml-2">{ aqiScale.name } ({ aqiScale.abbreviation }) AQI</caption>
                    <thead>
                      <tr>
                        <th>Category</th>
                        <th>Description</th>
                        <th>Values</th>
                        <th>Units</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        aqiThresholds[pollutant].abbreviations.map((abbreviation, idx) => {
                          return (
                            <tr key={abbreviation} style={{ backgroundColor: aqiThresholds[pollutant].backgroundColors[idx], color: aqiThresholds[pollutant].foregroundColors[idx] }}>
                              <td>{abbreviation}</td>
                              <td>{aqiThresholds[pollutant].descriptions[idx]}</td>
                              <td align="justify">
                                { aqiThresholds[pollutant].lowerLimits[idx] }&nbsp;{
                                  (idx+1 < aqiThresholds[pollutant].upperLimits.length) ?
                                    <>
                                      &ndash;&nbsp;{ aqiThresholds[pollutant].upperLimits[idx] }
                                    </>
                                  : 'or greater'}
                              </td>
                              <td>{aqiThresholds[pollutant].units}</td>
                            </tr>
                          );
                        })
                      }
                    </tbody>
                  </Table>
                </TabPane>
              )
            })
          }
        </TabContent>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  const { currentUser } = state,
        { updating } = currentUser,
        { aqiScales, isFetchingAqiScales } = state.aqiScales,
        user = currentUser.user || utils.auth.getUser(),
        aqiScale = utils.aqiScaleTools.getUserAqiScale(aqiScales, user);

  return {
    aqiScale,
    isFetchingData: isFetchingAqiScales || updating
  };
};

export default connect(
  mapStateToProps,
  null
)(AQIScaleTable);