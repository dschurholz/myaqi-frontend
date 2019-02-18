// MeasurementsTableRow.js

import React from 'react';

export default ({ measurement: { DateTimeStart, SiteId, MonitorName, Value, AQIIndex, AQICategoryDescription, AQIBackgroundColour, AQIForegroundColour } }) => {
  return (
    <tr>
      <td>{ DateTimeStart }</td>
      <td>{ SiteId }</td>
      <td>{ MonitorName }</td>
      <td>{ Value }</td>
      <td style={{ backgroundColor: AQIBackgroundColour, color: AQIForegroundColour }}>{ AQIIndex }</td>
      <td style={{ backgroundColor: AQIBackgroundColour, color: AQIForegroundColour }}>{ AQICategoryDescription }</td>
    </tr>
  );
};
