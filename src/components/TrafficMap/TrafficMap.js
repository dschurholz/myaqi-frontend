// TrafficMap.js

import { connect } from 'react-redux';
import GoogleMap from '../GoogleMap';

import { utils } from '../../utils';


function _format_markers_vic_roads_data (features) {
  let icon = 'data:image/svg+xml;utf-8,' + utils.svgIcons.getFireIcon("markers--community--Community_Information_Point");
  return features.map(feature => {
    return {
      latitude: feature.attributes["MIDPNT_LAT"],
      longitude: feature.attributes["MIDPNT_LON"],
      name: feature.attributes["HMGNS_LNK_DESC"],
      objectId: feature.attributes["OBJECTID"],
      iconUrl: icon
    };
  });
}

function _format_paths_vic_roads_data (features) {
  let getPathColor = (feature) => {
    let ratio = 1.0*feature.attributes["ALLVEHS_MMW"] / feature.attributes["ALLVEHS_AADT"];
    if (ratio <= 0.95) {
      return "#00FF00";
    }
    if (ratio > 0.95 && ratio <= 1.05) {
      return "#FFFF00";
    }
    return "#FF0000";
  };
  let paths = [];
  features.map(feature => {
    feature.geometry.paths.map((path, idx) => {
      let pathColor = getPathColor(feature);
      paths.push({
        objectId: feature.attributes["OBJECTID"] + "_" + (idx+1),
        name: feature.attributes["HMGNS_LNK_DESC"],
        pathColor: pathColor,
        ALLVEHS_MMW: feature.attributes["ALLVEHS_MMW"],
        ALLVEHS_AADT: feature.attributes["ALLVEHS_AADT"],
        coordinates: path.map(coordinates => {
          return {
            lng: coordinates[0],
            lat: coordinates[1]
          }
        })
      })
    });
  });
  return paths;
}


const mapStateToProps = state => {
  let markers = (state.traffic.traffic.features) ? _format_markers_vic_roads_data(state.traffic.traffic.features) : [],
      paths = (state.traffic.traffic.features) ? _format_paths_vic_roads_data(state.traffic.traffic.features) : [];
  return {
    markers: [],
    paths: paths.slice(0, Math.pow(10, 0)),
    polygons: [],
    apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
    keyField: 'objectId',
    extraMapStyles: {
        borderBottomLeftRadius: '4px',
        borderBottomRightRadius: '4px'
    },
    isFetchingData: state.traffic.isFetchingTraffic,
    layers: ['TrafficLayer']
  };
};

export default connect(
  mapStateToProps,
  null
)(GoogleMap);
