// MeasurementsTableRow.js

import React from 'react';
import Moment from 'react-moment';

export default ({ measurement: { DateTimeStart, SiteId, MonitorName, Value, AQIIndex, AQICategoryDescription, AQIBackgroundColour, AQIForegroundColour } }) => {
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
      <td style={{ backgroundColor: AQIBackgroundColour, color: AQIForegroundColour }}>{ AQIIndex }</td>
      <td style={{ backgroundColor: AQIBackgroundColour, color: AQIForegroundColour }}>{ AQICategoryDescription }</td>
    </tr>
  );
};
