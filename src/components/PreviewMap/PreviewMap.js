// PreviewMap.js

import { connect } from 'react-redux';
import GoogleMap from '../GoogleMap';

import { utils } from '../../utils';

const { visTools } = utils;


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

function _randomMarkers(aqiScale, vis=visTools.GAUGES, center=VICTORIA_CENTER) {
  var markers = [];

  const extraCheck = utils.aqiScaleTools.extraChecks(aqiScale.abbreviation),
        extended = true,
        aqiScaleThresholds = utils.charts.parseScale(aqiScale, 'aqi', extraCheck, extended),
        aqiThresh = utils.aqiScaleTools.parseAqiScale('aqi', aqiScale);

  const threshLen = aqiScaleThresholds.upperLimits.length;
  for (let thresh = 0; thresh < threshLen; thresh++) {
    const val = Math.round(
      aqiScaleThresholds.lowerLimits[thresh] + (thresh + 1 === threshLen ? aqiScaleThresholds.lowerLimits[thresh] + 100 :
      (aqiScaleThresholds.upperLimits[thresh] - aqiScaleThresholds.lowerLimits[thresh]) / 2));
    var newMarker = Object.assign({
      latitude: EXAMPLE_POINTS[thresh].lat,
      longitude: EXAMPLE_POINTS[thresh].lng,
      infowindowText: `<h4>
               Air quality is ${aqiThresh ? aqiThresh(val).description : aqiScaleThresholds.descriptions[thresh]}
             </h4>
             <div class="pinpoint-location">
              Level: ${val}
             </div>`,
      id: aqiScaleThresholds.abbreviations[thresh]
    }, visTools.getMapIcon(
        vis,
        aqiScaleThresholds.abbreviations[thresh],
        aqiScaleThresholds.backgroundColors[thresh],
        aqiScaleThresholds.foregroundColors[thresh],
        aqiScaleThresholds,
        val
    ));

    markers.push(newMarker);
  }
  return markers;
};

function _randomHeatmap(aqiScale, vis=visTools.HEATMAPS, center=VICTORIA_CENTER) {
  var heatmapLayers = [],
      heatmapLayerOptions = {
        radius: 25,
        opacity: 1
      };

  const extraCheck = utils.aqiScaleTools.extraChecks(aqiScale.abbreviation),
        aqiScaleThresholds = utils.charts.parseScale(aqiScale, 'aqi', extraCheck);

  if (vis === visTools.HOTSPOTS) {
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
        { aqiScales } = state.aqiScales,
        user = currentUser.user || utils.auth.getUser(),
        { visualization } = ownProps,
        aqiScale = utils.aqiScaleTools.getUserAqiScale(aqiScales, user);

  return {
    markers: (!!aqiScale && visualization && (visualization === visTools.GAUGES || visualization === visTools.PINS || visualization === visTools.PINS_TEXT)) ? _randomMarkers(aqiScale, visualization) : [],
    paths: [],
    polygons: [],
    heatmapLayers: (!!aqiScale && visualization && (visualization === visTools.HEATMAPS || visualization === visTools.HOTSPOTS)) ? _randomHeatmap(aqiScale, visualization) : [],
    apiKey: process.env.REACT_APP_GOOGLE_API_KEY, 
    keyField: 'id',
    extraMapStyles: {
      height: '300px'
    },
    forceRefresh: true,
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
