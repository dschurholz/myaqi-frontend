// SiteMap.js

import { connect } from 'react-redux';
import GoogleMap from '../GoogleMap';
import { siteSelected } from '../../actions';

import { utils } from '../../utils';

import { SettingsService } from '../../services';

const { visTools } = utils;

function getSiteExtraData(site, aqiScale, vis, aqiThresholds) {
  const aqiThresh = utils.aqiScaleTools.parseAqiScale('aqi', aqiScale);
  if (!site.current_status || site.current_status.length === 0) {
    const thresh = aqiThresh(0);
    return {
      icon: visTools.getMapIcon(vis, thresh.abbreviation, thresh.bgColour, thresh.fgColour, aqiThresholds, 0),
      infowindowText: null
    }
  }

  function _getStyles(value, desc) {
    const thresh = aqiThresh ? aqiThresh(value) : null,
          description = thresh ? thresh.description : desc;
    return Object.assign({
      infowindowText: `
       <h4>${site.name}</h4>
       <div>
          Air quality is ${description}
       </div>
       <div class="pinpoint-location">
         Level: ${Math.round(value)}
       </div>`
     },
      thresh ? visTools.getMapIcon(vis, thresh.abbreviation, thresh.bgColour, thresh.fgColour, aqiThresholds, value) : visTools.getDefaultIcon()
    );
  }

  let icon;
  for (let s in site.current_status) {
    let monitor = site.current_status[s];
    if (monitor.name === "AQI" || monitor.name === "Summary") {
      return _getStyles(monitor.value, monitor.description);
    }
  };

  return _getStyles(site.current_status[0].value, site.current_status[0].description);
}

function _useSiteHeatmap(sites, aqiScale, vis) {
  var heatmapLayers = [],
      heatmapLayerOptions = {
        radius: 25,
        opacity: 0.8
      };

  const extraCheck = utils.aqiScaleTools.extraChecks(aqiScale.abbreviation),
        extended = true,
        aqiScaleThresholds = utils.charts.parseScale(aqiScale, 'aqi', extraCheck, extended),
        aqiThresh = utils.aqiScaleTools.parseAqiScale('aqi', aqiScale);

  function getCurrentVal (site) {
    if (!site.current_status || site.current_status.length === 0) {
      return 0;
    } else {
      for (let s in site.current_status) {
        let monitor = site.current_status[s];
        if (monitor.name === "AQI" || monitor.name === "Summary") {
          return monitor.value;
        }
      };
      return site.current_status[0].value;
    }
  };

  if (vis === visTools.HOTSPOTS) {
    sites.forEach(site => {
      const thresh = aqiThresh(getCurrentVal(site));
      heatmapLayers.push({
        gradient: [utils.tools.hexToRgba(thresh.bgColour, '0')].concat(thresh.bgColour),
        data: [{
          latitude: site.latitude,
          longitude: site.longitude,
          weight: 1
        }],
        radius: heatmapLayerOptions.radius,
        opacity: heatmapLayerOptions.opacity
      });
    });
  } else {
    var newLayer = {
      gradient: [utils.tools.hexToRgba(aqiScaleThresholds.backgroundColors[0], '0')],
      data: [],
      radius: heatmapLayerOptions.radius,
      opacity: heatmapLayerOptions.opacity
    }
    sites.map(site => {
      const val = getCurrentVal(site);
      var weight = 1;
      for (let thresh = 0; thresh < aqiScaleThresholds.upperLimits.length && val >= aqiScaleThresholds.lowerLimits[thresh]; thresh++) {
        weight = thresh;
        if (!newLayer.gradient.includes(aqiScaleThresholds.backgroundColors[thresh])) {
          newLayer.gradient.push(aqiScaleThresholds.backgroundColors[thresh]);
        }
      }
      newLayer.data.push({
        latitude: site.latitude,
        longitude: site.longitude,
        weight: weight
      });
    });

    heatmapLayers.push(newLayer);
  }

  return heatmapLayers;
};

const mapStateToProps = (state, ownProps) => {
  const { currentUser, sites } = state,
        { aqiScales, isFetchingAqiScales } = state.aqiScales,
        user = currentUser.user || utils.auth.getUser(),
        aqiScale = utils.aqiScaleTools.getUserAqiScale(aqiScales, user),
        { vis_tool } = user.profile,
        { scaleMarkers } = ownProps;

  var aqiThresholds = [];
  if (aqiScale) {
    var extraCheck = utils.aqiScaleTools.extraChecks(aqiScale.abbreviation), extended = true;
    aqiThresholds = utils.charts.parseScale(aqiScale, 'aqi', extraCheck, extended);
  }

  const heatmapLayers = (visTools.HEATMAP_VISUALISATION_TOOLS.includes(vis_tool) && sites.sites && aqiScale) ?
        _useSiteHeatmap(sites.sites, aqiScale, vis_tool) : [];

  return {
    markers: sites.sites.map(site => {
      let extraInfo = getSiteExtraData(site, aqiScale, vis_tool, aqiThresholds);
      return Object.assign(site, extraInfo);
    }),
    paths: [],
    polygons: [],
    heatmapLayers: heatmapLayers,
    apiKey: process.env.REACT_APP_GOOGLE_API_KEY, 
    keyField: 'site_id',
    extraMapStyles: {
        'borderBottomLeftRadius': '4px',
        'borderBottomRightRadius': '4px'
    },
    isFetchingData: sites.isFetchingSites || isFetchingAqiScales,
    scaleMarkers: (vis_tool === visTools.PINS || vis_tool === visTools.PINS_TEXT) ? null : scaleMarkers
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onMarkerSelected: selectedSite => {
      dispatch(siteSelected(selectedSite));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GoogleMap);
