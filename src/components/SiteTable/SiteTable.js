// SiteTable.js

import React from 'react';
import { connect } from 'react-redux';
import { Table } from 'reactstrap';
import SiteTableRow from '../SiteTableRow';

function SiteTable({ sites }) {
  if(!sites.length) {
    return (
      <div>
        No Sites available
      </div>
    )
  }
  return (
    <Table responsive>
      <thead>
        <tr>
          <th>Id</th>
          <th>Name</th>
          <th>Fire Hazard Cat.</th>
          <th>Is Offline</th>
          <th>Has Incident</th>
          <th>Region</th>
        </tr>
      </thead>
      <tbody>
        {sites.map(site => {
          return (
            <SiteTableRow site={ site } key={ site.site_id } />
          );
        })}
      </tbody>
    </Table>
  );
}

const mapStateToProps = state => {
  return {
    sites: state.sites
  };
};

export default connect(
  mapStateToProps,
  null
)(SiteTable);