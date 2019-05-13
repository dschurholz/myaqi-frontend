// FireMap.js

import { connect } from 'react-redux';
import GoogleMap from '../GoogleMap';
import { historicFireSelected } from '../../actions';

import { utils } from '../../utils';

var CATEGORIES = ["Fire", "Burn Area"];
var FIGURE_TYPES = ["Polygon", "MultiPolygon"];

var getFireStyles = (fire) => {
  if(fire.fire_svrty.startsWith("BURNT_5"))
    return {color: "#333333", icon: 'data:image/svg+xml;utf-8,' + utils.svgIcons.getFireIcon("markers--incident--Fire_Active")};
  if(fire.fire_svrty.startsWith("BURNT_4"))
    return {color: "red", icon: 'data:image/svg+xml;utf-8,' + utils.svgIcons.getFireIcon("markers--warning--Emergency_Warning")};
  if(fire.fire_svrty.startsWith("BURNT_3"))
    return {color: "orange", icon: 'data:image/svg+xml;utf-8,' + utils.svgIcons.getFireIcon("markers--incident--Fire")};
  if(fire.fire_svrty.startsWith("BURNT_2"))
    return {color: "yellow", icon: 'data:image/svg+xml;utf-8,' + utils.svgIcons.getFireIcon("markers--incident--Fire")};
  return {color: "blue", icon: 'data:image/svg+xml;utf-8,' + utils.svgIcons.getFireIcon("markers--incident--Fire")};
};

var getTrafficStationStyles = (trafficStation) => {
  return {color: "purple", icon: 'data:image/svg+xml;utf-8,' + utils.svgIcons.getFireIcon("markers--incident--Accident_Collision")}
}

var getSiteStyles = (site) => {
  // if(fire.fire_svrty.startsWith("BURNT_5"))
  //   return {color: "#333333", icon: 'data:image/svg+xml;utf-8,' + utils.svgIcons.getFireIcon("markers--incident--Fire_Active")};
  // if(fire.fire_svrty.startsWith("BURNT_4"))
  //   return {color: "red", icon: 'data:image/svg+xml;utf-8,' + utils.svgIcons.getFireIcon("markers--warning--Emergency_Warning")};
  // if(fire.fire_svrty.startsWith("BURNT_3"))
  //   return {color: "orange", icon: 'data:image/svg+xml;utf-8,' + utils.svgIcons.getFireIcon("markers--incident--Fire")};
  // if(fire.fire_svrty.startsWith("BURNT_2"))
  //   return {color: "yellow", icon: 'data:image/svg+xml;utf-8,' + utils.svgIcons.getFireIcon("markers--incident--Fire")};
  return {color: "green", icon: 'data:image/svg+xml;utf-8,' + utils.svgIcons.getGaugeIcon("light")};
};

function _format_markers_sites(sites) {
  return sites.map((site) => {
    let siteStyle = getSiteStyles(site);
    site.iconUrl = siteStyle.icon;
    site.infowindowText = `<h4>
         ${site.name}
       </h4>`;
    return site;
  });
}

function _format_markers_traffic_stations (traffic_stations) {
  return traffic_stations.map((station) => {
    let stationStyle = getTrafficStationStyles(station);
    station.iconUrl = stationStyle.icon;
    station.infowindowText = `<h4>
         ${station.name}
       </h4>`;
    return station;
  });
}

function _format_polygons_sites(sites) {
  return sites.map((site) => {
    const siteStyle = getSiteStyles(site),
          polygon = JSON.parse(site.fire_area);
    return {
      objectId: site.site_id,
      name: site.name,
      lineColor: siteStyle.color,
      coordinates: polygon.coordinates[0].map(coordinates => {
        return {
          lng: coordinates[0],
          lat: coordinates[1]
        }
      }),
      obj: site
    }
  });
}

function _format_polygons_fires (fires, timelineEntry) {
  let polygons = [];

  if (fires.length > 0 && !!timelineEntry) {
    timelineEntry.fires.forEach(fire_id => {
      const fire = fires.find((e) => {return e.id === fire_id});
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
  }
  return polygons;
}


const mapStateToProps = state => {
  const { experimentsData, isFetchingExperimentsMapData } = state.experimentsMapData,
        { selectedExperimentsDate } = state,
        timelineEntry = experimentsData.timeline && selectedExperimentsDate ? experimentsData.timeline[selectedExperimentsDate] : null;


  let markers = ((experimentsData.traffic_stations.length > 0) ? _format_markers_traffic_stations(experimentsData.traffic_stations) : []).concat(
                 (experimentsData.sites.length > 0) ? _format_markers_sites(experimentsData.sites) : []),
      polygons = ((experimentsData.sites.length > 0) ?_format_polygons_sites(experimentsData.sites): []).concat(
                  (experimentsData.fires.length > 0) ? _format_polygons_fires(experimentsData.fires, timelineEntry) : []);

  return {
    markers: markers,
    paths: [],
    polygons: polygons,
    apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
    keyField: 'objectId',
    extraMapStyles: {
        'borderBottomLeftRadius': '4px',
        'borderBottomRightRadius': '4px',
        ploygonStrokeWight: 1,
        ploygonFillOpacity: 0.2,
        useLineColour: true
    },
    isFetchingData: isFetchingExperimentsMapData
  };
};

// const mapDispatchToProps = dispatch => {
//   return {
//     // onMarkerSelected: selectedFire => {
//     //   dispatch(fireSelected(selectedFire));
//     // },
//     onPolygonSelected: selectedFire => {
//       dispatch(historicFireSelected(selectedFire));
//     }
//   };
// };

export default connect(
  mapStateToProps,
  // mapDispatchToProps
)(GoogleMap);
