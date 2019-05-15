// FireMap.js

import { connect } from 'react-redux';
import GoogleMap from '../GoogleMap';

import { utils } from '../../utils';
import { SettingsService } from '../../services';

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
  const { gaugeTheme } = SettingsService.getSettings();
  return {color: "green", icon: 'data:image/svg+xml;utf-8,' + utils.svgIcons.getGaugeIcon(gaugeTheme)};
};

function _format_markers_sites(sites, timelineEntry=null) {
  const { gaugeTheme } = SettingsService.getSettings();

  return sites.map((site) => {
    let siteStyle = getSiteStyles(site), val = 'Unknown';
    if (timelineEntry){
      const measurements = timelineEntry['sites'][site.site_id.toString()],
            mIdx = measurements.findIndex((el) => Object.keys(el)[0] === 'AQI');
      if (mIdx > -1) {
        val = measurements[mIdx]['AQI'];
        siteStyle.icon = 'data:image/svg+xml;utf-8,' + utils.svgIcons.getGaugeIcon(gaugeTheme, parseInt(val));
      }
    }
    site.iconUrl = siteStyle.icon;
    site.infowindowText = `<h4>
         ${site.name}
       </h4>
       <div class="pinpoint-location">
        AQI: ${val}
       </div>`;
    return site;
  });
}

function _format_markers_traffic_stations (traffic_stations, timelineEntry) {
  return traffic_stations.map((station) => {
    let stationStyle = getTrafficStationStyles(station), val = 'Unknown';
    if (timelineEntry){
      val = timelineEntry['traffic_flows'][station.station_id.toString()];
    }
    station.iconUrl = stationStyle.icon;
    station.infowindowText = `<h4>
         ${station.name}
       </h4>
       <div class="pinpoint-location">
        # of cars: ${val}
       </div>`;
    station.hideWhenFar = true;
    return station;
  });
}

function _format_paths_traffic_stations (trafficStations, timelineEntry) {
  return trafficStations.map(station => {
    let pathColor = '#0000FF';
    if (timelineEntry){
      const trafficVol = timelineEntry['traffic_flows'][station.station_id.toString()];
      pathColor = utils.trafficFlowTools.getPathColor(trafficVol, station.quantiles);
    }
    return {
      objectId: station.station_id,
      name: station.name,
      pathColor: pathColor,
      coordinates: station.path.coordinates[0].map(coordinates => {
        return {
          lng: coordinates[0],
          lat: coordinates[1]
        }
      }),
      obj: station
    }
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
      fillOpacity: 0.01,
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


  let markers = ((experimentsData.traffic_stations.length > 0) ? _format_markers_traffic_stations(experimentsData.traffic_stations, timelineEntry) : []).concat(
                 (experimentsData.sites.length > 0) ? _format_markers_sites(experimentsData.sites, timelineEntry) : []),
      polygons = ((experimentsData.sites.length > 0) ?_format_polygons_sites(experimentsData.sites): []).concat(
                  (experimentsData.fires.length > 0) ? _format_polygons_fires(experimentsData.fires, timelineEntry) : []),
      paths = (experimentsData.traffic_stations.length > 0) ? _format_paths_traffic_stations(experimentsData.traffic_stations, timelineEntry) : [];

  return {
    markers: markers,
    paths: paths,
    polygons: polygons,
    apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
    keyField: 'objectId',
    extraMapStyles: {
        'borderBottomLeftRadius': '4px',
        'borderBottomRightRadius': '4px',
        ploygonStrokeWeight: 1,
        ploygonFillOpacity: 0.3,
        useLineColour: true
    },
    noZoomToBounds: true,
    isFetchingData: isFetchingExperimentsMapData,
    forceRefresh: true,
    hideWhenFar: true
    // forceClusters: true
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
