// PreviewMap.js

import { connect } from 'react-redux';
import GoogleMap from '../GoogleMap';
import { siteSelected } from '../../actions';

import { utils } from '../../utils';


const VICTORIA_CENTER = {
  lat: -37.8462199,
  lng: 145.139506
}, EXAMPLE_POINTS = [
  {
    lat: -37.853,
    lng: 145.124
  },
  {
    lat: -37.848,
    lng: 145.129
  },
  {
    lat: -37.853,
    lng: 145.134
  },
  {
    lat: -37.848,
    lng: 145.139
  },
  {
    lat: -37.853,
    lng: 145.144
  },
  {
    lat: -37.848,
    lng: 145.149
  },
];

function _randomMarkers(aqiScale, visualization={pinsText:true}, center=VICTORIA_CENTER) {
  var markers = [];

  const extraCheck = utils.aqiScaleTools.extraChecks(aqiScale.abbreviation),
        extended = true,
        aqiScaleThresholds = utils.charts.parseScale(aqiScale, 'aqi', extraCheck, true);

  for (let thresh = 0; thresh < aqiScaleThresholds.upperLimits.length; thresh++) {
    markers.push({
      latitude: EXAMPLE_POINTS[thresh].lat,
      longitude: EXAMPLE_POINTS[thresh].lng,
      name: `<h4>
               Air quality is ${aqiScaleThresholds.descriptions[thresh]}
             </h4>
             <div class="pinpoint-location">
              Level: ${Math.round((thresh+1 === aqiScaleThresholds.upperLimits.length) ? aqiScaleThresholds.upperLimits[thresh-1] + 100: aqiScaleThresholds.upperLimits[thresh] - 5)}
             </div>`,
      id: aqiScaleThresholds.abbreviations[thresh],
      iconUrl: visualization.pinsText ?
        `https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=${aqiScaleThresholds.abbreviations[thresh]}|${aqiScaleThresholds.backgroundColors[thresh].split('#')[1]}|${aqiScaleThresholds.foregroundColors[thresh].split('#')[1]}`
          : null,
      icon: visualization.pins ?
        {
          path: 'M0-48c-9.8 0-17.7 7.8-17.7 17.4 0 15.5 17.7 30.6 17.7 30.6s17.7-15.4 17.7-30.6c0-9.6-7.9-17.4-17.7-17.4z',
          fillColor: aqiScaleThresholds.backgroundColors[thresh],
          fillOpacity: 0.8,
          scale: 1,
          strokeOpacity: 0.2
        } : null
    });
  }
  return markers;
};

function _randomHeatmap(aqiScale, visualization={heatmap:true}, center=VICTORIA_CENTER) {
  var heatmapLayers = [],
      heatmapLayerOptions = {
        radius: 25,
        opacity: 1
      };

  const extraCheck = utils.aqiScaleTools.extraChecks(aqiScale.abbreviation),
        aqiScaleThresholds = utils.charts.parseScale(aqiScale, 'aqi', extraCheck);

  if (visualization.hotspots) {
    for (let thresh = 0; thresh < aqiScaleThresholds.upperLimits.length; thresh++) {
      heatmapLayers.push({
        gradient: [utils.tools.hexToRgba(aqiScaleThresholds.backgroundColors[thresh], '0')].concat(aqiScaleThresholds.backgroundColors[thresh]),
        data: [{
          latitude: EXAMPLE_POINTS[thresh].lat,
          longitude: EXAMPLE_POINTS[thresh].lng,
          weight: 1
        }],
        radius: heatmapLayerOptions.radius,
        opacity: heatmapLayerOptions.opacity
      });
    }
  } else {
    heatmapLayers.push(Object.assign(heatmapLayerOptions, {
      gradient: [utils.tools.hexToRgba(aqiScaleThresholds.backgroundColors[0], '0')].concat(aqiScaleThresholds.backgroundColors),
      data: []
    }));
    for (let thresh = 0; thresh < aqiScaleThresholds.upperLimits.length; thresh++) {
      heatmapLayers[0].data.push({
        latitude: EXAMPLE_POINTS[thresh].lat,
        longitude: EXAMPLE_POINTS[thresh].lng,
        weight: Math.round((thresh+1 === aqiScaleThresholds.upperLimits.length) ? aqiScaleThresholds.upperLimits[thresh-1] + 100: aqiScaleThresholds.upperLimits[thresh] - 5)
      });
    }
  }

  return heatmapLayers;
};

const mapStateToProps = (state, ownProps) => {
  const { currentUser } = state,
        { updating } = currentUser,
        { aqiScales, isFetchingAqiScales } = state.aqiScales,
        user = currentUser.user || utils.auth.getUser(),
        { visualization } = ownProps; 

  var aqiScale = null;
  if (aqiScales.length > 0) {
    aqiScale = aqiScales[aqiScales.findIndex(x => {
      return x.abbreviation === user.profile.aqi_scale;
    })];
  }

  return {
    markers: (!!aqiScale && visualization && (visualization.pins || visualization.pinsText)) ? _randomMarkers(aqiScale, visualization) : [],
    paths: [],
    polygons: [],
    heatmapLayers: (!!aqiScale && visualization && (visualization.heatmap || visualization.hotspots)) ? _randomHeatmap(aqiScale, visualization) : [],
    apiKey: process.env.REACT_APP_GOOGLE_API_KEY, 
    keyField: 'id',
    extraMapStyles: {
      height: '300px'
    },
    extraMapOptions: {
      zoom: 12,
      center: VICTORIA_CENTER,
      extra: {
        disableDefaultUI: true,
      }
    },
    updating: updating
  };
};

export default connect(
  mapStateToProps,
  null
)(GoogleMap);
