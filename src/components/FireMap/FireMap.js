// FireMap.js

import { connect } from 'react-redux';
import GoogleMap from '../GoogleMap';
import { fireSelected } from '../../actions';

import { utils } from '../../utils';

var CATEGORIES = ["Fire", "Burn Area"];
var FIGURE_TYPES = ["Polygon", "MultiPolygon"];

var getFeatureStyles = (feature) => {
  switch (feature.properties.feedType) {
    case "warning":
      if (feature.properties.sourceTitle === "Community Information")
        return {color: "blue", icon: 'data:image/svg+xml;utf-8,' + utils.svgIcons.getFireIcon("markers--warning--Community_Update")};
      if (feature.properties.status === "Extreme") 
        return {color: "red", icon: 'data:image/svg+xml;utf-8,' + utils.svgIcons.getFireIcon("markers--warning--Emergency_Warning")};
      if (feature.properties.status === "Moderate")
        return {color: "orange", icon: 'data:image/svg+xml;utf-8,' + utils.svgIcons.getFireIcon("markers--warning--Warning-Watch_and_Act")};
      return {color: "yellow", icon: 'data:image/svg+xml;utf-8,' + utils.svgIcons.getFireIcon("markers--warning--Advice")};
    case "incident":
    case "burn-area":
      return {color: "#333333", icon: 'data:image/svg+xml;utf-8,' + utils.svgIcons.getFireIcon(feature.properties.status === "Under Control" ? "markers--incident--Fire" : "markers--incident--Fire_Active")};
    default:
      return {color: "#00FF00", icon: 'data:image/svg+xml;utf-8,' + utils.svgIcons.getFireIcon("markers--incident--Fire")};
  }
};

function _format_markers_vic_emergency_data (features) {
  let markers = [];
  features.filter(feature => CATEGORIES.includes(feature.properties.category1) ||
                             CATEGORIES.includes(feature.properties.category2)).forEach(feature => {
    let points = [],
        markerIcon = getFeatureStyles(feature).icon;
    if (feature.geometry && feature.geometry.geometries) {
      points =  feature.geometry.geometries.filter(figure => figure.type === "Point");
    } else if (feature.geometry && feature.geometry.type === "Point") {
      points =  [feature.geometry];
    } else {
      // TODO: check if makes sense to take the center of Polygon
      points = [];
    }
    points.forEach(point => {
      markers.push({
        latitude: point.coordinates[1],
        longitude: point.coordinates[0],
        name: feature.properties.name || feature.properties.sourceTitle || feature.properties.category1,
        objectId: feature.properties["id"],
        iconUrl: markerIcon,
        obj: feature
      });
    });
  });
  return markers;
}

function _format_polygons_vic_emergency_data (features) {
  let polygons = [];
  features.filter(feature => CATEGORIES.includes(feature.properties.category1) ||
                             CATEGORIES.includes(feature.properties.category2)).forEach(feature => {
    let figures = [],
        polygonColor = getFeatureStyles(feature).color;
    if (feature.geometry && feature.geometry.geometries) {
      figures = feature.geometry.geometries.filter(figure => FIGURE_TYPES.includes(figure.type));
    } else if (FIGURE_TYPES.includes(feature.geometry.type)) {
      figures = [feature.geometry];
    } else {
      return;
    }
    figures.forEach((polygon, idx) => {
      let coor = polygon.coordinates[0], flatIdx = 1;
      while (!Array.isArray(coor)) {
        coor = coor[0];
        flatIdx++;
      }
      coor = polygon.coordinates.flat(flatIdx);
      if (polygon.type === "Polygon") {
        coor = [coor];
      }
      for (let c in coor) {
        polygons.push({
          objectId: feature.properties["id"] + "_" + (idx+1) + "_" + (c+1),
          name: feature.properties["name"],
          lineColor: polygonColor,
          coordinates: coor[c].map(coordinates => {
            return {
              lng: coordinates[0],
              lat: coordinates[1]
            }
          })
        })
      }
    });
  });
  return polygons;
}


const mapStateToProps = state => {
  let markers = (state.fires.fires.features) ? _format_markers_vic_emergency_data(state.fires.fires.features) : [],
      polygons = (state.fires.fires.features) ? _format_polygons_vic_emergency_data(state.fires.fires.features) : [];
  return {
    markers: markers,
    paths: [],
    polygons: polygons,
    apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
    keyField: 'objectId',
    extraMapStyles: {
        'borderBottomLeftRadius': '4px',
        'borderBottomRightRadius': '4px'
    },
    isFetchingData: state.fires.isFetchingFires
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onMarkerSelected: selectedFire => {
      dispatch(fireSelected(selectedFire));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GoogleMap);
