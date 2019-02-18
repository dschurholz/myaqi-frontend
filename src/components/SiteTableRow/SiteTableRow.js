// SiteTableRow.js

import React from 'react';
import {Badge} from 'reactstrap';

export default ({ site: { site_id, name, fire_hazard_category, is_station_offline, has_incident, site_list } }) => {
  return (
    <tr>
      <td>{ site_id }</td>
      <td>{ name }</td>
      <td>{ (fire_hazard_category)?fire_hazard_category:'-' }</td>
      <td>{ (is_station_offline)?<Badge color="danger">Offline</Badge>:<Badge color="success">Online</Badge> }</td>
      <td>{ (has_incident)?<Badge color="danger">Yes</Badge>:<Badge color="success">No</Badge> }</td>
      <td>{ (site_list.length > 0)?site_list[0].name:'-' }</td>
    </tr>
  );
};
