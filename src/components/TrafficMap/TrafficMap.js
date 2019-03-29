// TrafficMap.js

import { connect } from 'react-redux';
import GoogleMap from '../GoogleMap';

import { utils } from '../../utils';


function _format_markers_vic_roads_anual_data (features) {
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

function _format_paths_vic_roads_anual_data (features) {
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

function _format_markers_vic_roads_live_data (traffic) {
  function getTypeDescription(alertType, incidentType) {
    switch (alertType) {
      case 'emergency':
        switch (incidentType) {
          case 'Vehicle Collision':
            return {
              icon: "markers--incident--Accident_Collision",
              text: 'Vehicle Collision'
            };
          default:
            return {
              icon: "markers--warning--Emergency_Warning",
              text: incidentType
            };
        };
      case 'alert':
        return {
          icon: "markers--warning--Advice",
          text: incidentType
        };
      case 'traveltime':
        return {
          icon: "markers--warning--Community_Update",
          text: incidentType
        };
      case 'roadworks':
        switch (incidentType) {
          case 'road closed':
            return {
              icon: "markers--closure--Road_Closed",
              text: incidentType
            };
          default:
            return {
              icon: "markers--closure--Road_Works",
              text: incidentType
            };
        };
      case 'event':
      default:
        return {
          icon: "markers--incident--Other_Incident",
          text: incidentType
        };
    }
  }
  var markers = [];
  traffic.incidents.forEach(incident => {
    let typeDesctiption = getTypeDescription(incident.alert_type, incident.incident_type);
    markers.push({
      latitude: incident.lat,
      longitude: incident.long,
      name: incident.description + " - " + typeDesctiption.text,
      objectId: incident.id,
      iconUrl: 'data:image/svg+xml;utf-8,' + utils.svgIcons.getFireIcon(typeDesctiption.icon)
      // iconUrl: 'https://traffic.vicroads.vic.gov.au/assets/indicators/roadworks-x2-664f355f098c42f2eb3e45ee47fd62fb400d77829bd7db37058dcfaf54691ea0.png'
    });
  });
  return markers;
}

function _format_paths_vic_roads_live_data (features) {
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

function _format_markers_bing_data(traffic) {

  function getTypeDescription(type) {
    switch (type) {
      case 1: // Accident
        return {
          icon: "markers--incident--Accident_Collision",
          text: "Accident"
        };
      case 2: // Congestion
        return {
          icon: "markers--warning--Advice",
          text: "Congestion"
        };
      case 3: // DisabledVehicle
        return {
          icon: "markers--incident--Accident_Collision",
          text: "Disabled Vehicle"
        };
      case 4: // MassTransit
        return {
          icon: "markers--warning--Warning-Watch_and_Act",
          text: "Mass Transit"
        };
      case 5: // Miscellaneous
        return {
          icon: "markers--warning--Community_Update",
          text: "Miscellaneous"
        };
      case 6: // OtherNews
        return {
          icon: "markers--incident--Other_Incident",
          text: "Other News"
        };
      case 7: // PlannedEvent
        return {
          icon: "markers--media--Media_Assembly_Point",
          text: "Planned Event"
        };
      case 8: // RoadHazard
        return {
          icon: "markers--warning--Emergency_Warning",
          text: "Road Hazard"
        };
      case 9: // Construction
        return {
          icon: "markers--closure--Road_Works",
          text: "Construction"
        };
      case 10: // Alert
        return {
          icon: "markers--warning--Advice",
          text: "Alert"
        };
      case 11: // Weather
      default:
        return {
          icon: "markers--incident--Severe_Weather",
          text: "Weather"
        };
    }
  }
  var markers = [];
  traffic.resourceSets.forEach(resourceSet => {
    resourceSet.resources.forEach(resource => {
      let typeDesctiption = getTypeDescription(resource.type);
      markers.push({
        latitude: resource.point.coordinates[0],
        longitude: resource.point.coordinates[1],
        name:  resource.description + " - " + typeDesctiption.text,
        objectId: resource.incidentId,
        iconUrl: 'data:image/svg+xml;utf-8,' + utils.svgIcons.getFireIcon(typeDesctiption.icon)
      });
    });
  });

  return markers;
}


const mapStateToProps = (state, ownProps) => {
  // let markers = (state.traffic.vicRoadsTraffic.features) ? _format_markers_vic_roads_data(state.traffic.vicRoadsTraffic.features) : [],
  //     paths = (state.traffic.vicRoadsTraffic.features) ? _format_paths_vic_roads_data(state.traffic.vicRoadsTraffic.features) : [];
  var markers = [];
  if (state.traffic.vicRoadsTraffic.incidents && ownProps.apiSources.vicRoads) {
    markers = markers.concat(_format_markers_vic_roads_live_data(state.traffic.vicRoadsTraffic));
  }
  if (state.traffic.bingTraffic.resourceSets  && ownProps.apiSources.bing) {
    markers = markers.concat(_format_markers_bing_data(state.traffic.bingTraffic));
  }
  return {
    markers: markers,
    paths: [],
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
