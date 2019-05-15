// HistoricFireMap.js

import { connect } from 'react-redux';
import GoogleMap from '../GoogleMap';
import { historicFireSelected } from '../../actions';

import { utils } from '../../utils';

var FIGURE_TYPES = ["Polygon", "MultiPolygon"];

var getFireStyles = (fire) => {
  if(fire.fire_svrty.startsWith("BURNT_5") || fire.fire_svrty.startsWith("BURNT_NONFOREST"))
    return {color: "#333333", icon: 'data:image/svg+xml;utf-8,' + utils.svgIcons.getFireIcon("markers--incident--Fire_Active")};
  if(fire.fire_svrty.startsWith("BURNT_4") || fire.fire_svrty.startsWith("BURNT_FOREST"))
    return {color: "red", icon: 'data:image/svg+xml;utf-8,' + utils.svgIcons.getFireIcon("markers--warning--Emergency_Warning")};
  if(fire.fire_svrty.startsWith("BURNT_3"))
    return {color: "orange", icon: 'data:image/svg+xml;utf-8,' + utils.svgIcons.getFireIcon("markers--incident--Fire")};
  if(fire.fire_svrty.startsWith("BURNT_2"))
    return {color: "yellow", icon: 'data:image/svg+xml;utf-8,' + utils.svgIcons.getFireIcon("markers--incident--Fire")};
  return {color: "blue", icon: 'data:image/svg+xml;utf-8,' + utils.svgIcons.getFireIcon("markers--incident--Fire")};
};

// function _format_traffic_flows (features) {
//   let markers = [];
//   features.filter(feature => CATEGORIES.includes(feature.properties.category1) ||
//                              CATEGORIES.includes(feature.properties.category2)).forEach(feature => {
//     let points = [],
//         markerIcon = getFeatureStyles(feature).icon;
//     if (feature.geometry && feature.geometry.geometries) {
//       points =  feature.geometry.geometries.filter(figure => figure.type === "Point");
//     } else if (feature.geometry && feature.geometry.type === "Point") {
//       points =  [feature.geometry];
//     } else {
//       // TODO: check if makes sense to take the center of Polygon
//       points = [];
//     }
//     points.forEach(point => {
//       markers.push({
//         latitude: point.coordinates[1],
//         longitude: point.coordinates[0],
//         name: feature.properties.name || feature.properties.sourceTitle || feature.properties.category1,
//         objectId: feature.properties["id"],
//         iconUrl: markerIcon,
//         obj: feature
//       });
//     });
//   });
//   return markers;
// }

function _format_polygons_fires (fires) {
  let polygons = [];
  // fires.filter(feature => CATEGORIES.includes(feature.properties.category1) ||
  //                            CATEGORIES.includes(feature.properties.category2))
  fires.forEach(fire => {
    let figures = [],
        polygonColor = getFireStyles(fire).color;
    if (fire.geom && Array.isArray(fire.geom)) {
      figures = fire.geom.filter(figure => FIGURE_TYPES.includes(figure.type));
    } else if (fire.geom) {
      figures = [fire.geom];
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
      for (let c in coor) {
        polygons.push({
          objectId: fire.id,
          name: fire.name,
          lineColor: polygonColor,
          coordinates: coor[c].map(coordinates => {
            return {
              lng: coordinates[0],
              lat: coordinates[1]
            }
          }),
          obj: fire
        })
      }
    });
  });
  return polygons;
}


const mapStateToProps = state => {
  const { historicFires } = state;

  // console.log(historicFires.fires);
  // let markers = (historicFires.fires.fires) ? _format_markers_vic_emergency_data(state.fires.fires.features) : [],
  let polygons = (historicFires.fires.results) ? _format_polygons_fires(historicFires.fires.results) : [];

  return {
    markers: [],
    paths: [],
    polygons: polygons,
    apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
    keyField: 'objectId',
    extraMapStyles: {
        'borderBottomLeftRadius': '4px',
        'borderBottomRightRadius': '4px'
    },
    isFetchingData: historicFires.isFetchingHistoricFires
  };
};

const mapDispatchToProps = dispatch => {
  return {
    // onMarkerSelected: selectedFire => {
    //   dispatch(fireSelected(selectedFire));
    // },
    onPolygonSelected: selectedFire => {
      dispatch(historicFireSelected(selectedFire));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GoogleMap);
