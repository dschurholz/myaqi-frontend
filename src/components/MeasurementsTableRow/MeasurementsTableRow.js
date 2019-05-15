// MeasurementsTableRow.js

import React from 'react';
import Moment from 'react-moment';

class MeasurementsTableRow extends React.Component { 

  render() {

    var customStyle = null;
    const { measurement, getAQIScaleCustom, pollutant } = this.props,
          { DateTimeStart, SiteId, MonitorName, Value, AQIIndex, AQICategoryDescription, AQIBackgroundColour, AQIForegroundColour } = measurement;

    if (Value !== '-' && getAQIScaleCustom && typeof getAQIScaleCustom === 'function') {
      customStyle = getAQIScaleCustom(Value);
    }

    return (
      <tr>
        <td>
          <Moment parse="YYYY-MM-DDTHH:mm:SS" format="YYYY-MM-DD">
            { DateTimeStart }
          </Moment>
        </td>
        <td>
          <Moment parse="YYYY-MM-DDTHH:mm:SS" format="HH:mm">
            { DateTimeStart }
          </Moment>
        </td>
        <td>{ SiteId }</td>
        <td>{ MonitorName }</td>
        <td>{ Value }</td>
        {
          pollutant !== 'aqi' ?
            customStyle ?
              <>
                <td style={{ textAlign: 'center', backgroundColor: customStyle.bgColour, color: customStyle.fgColour }}>{ AQIIndex }</td>
              </>
              :
              <>
                <td style={{ textAlign: 'center', backgroundColor: AQIBackgroundColour, color: AQIForegroundColour }}>{ AQIIndex }</td>
              </>
            :
            <></>
        }
        {
          customStyle ?
          <>
            <td style={{ textAlign: 'center', backgroundColor: customStyle.bgColour, color: customStyle.fgColour }}>{ customStyle.description }</td>
          </>
          :
          <>
            <td style={{ textAlign: 'center', backgroundColor: AQIBackgroundColour, color: AQIForegroundColour }}>{ AQICategoryDescription }</td>
          </>
        }
      </tr>
    );
  }
};

export default MeasurementsTableRow;