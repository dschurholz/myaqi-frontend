// SiteMap.js

import { connect } from 'react-redux';
import GoogleMap from '../GoogleMap';
import { siteSelected } from '../../actions';

import { utils } from '../../utils';

import { SettingsService } from '../../services';

function getSiteExtraData(site, aqiScale, gaugeStyles) {
  const { gaugeTheme } = SettingsService.getSettings(),
        aqiThresh = utils.aqiScaleTools.parseAqiScale('aqi', aqiScale);

  if (!site.current_status || site.current_status.length === 0) {
    return {
      icon: 'data:image/svg+xml;utf-8,' + utils.svgIcons.getGaugeIcon(gaugeTheme),
      infowindowText: null
    }
  }

  function _getStyles(value, desc) {
    const description = aqiThresh ? aqiThresh(value).description : desc;
    if (gaugeStyles) {
        icon = utils.svgIcons.getGaugeIcon(gaugeTheme, value, gaugeStyles.limits, gaugeStyles.colors);
    } else {
      icon = utils.svgIcons.getGaugeIcon(gaugeTheme, value);
    }
    return {
      icon: 'data:image/svg+xml;utf-8,' + icon,
      infowindowText: `
       <h4>${site.name}</h4>
       <div>
          Air quality is ${description}
       </div>
       <div class="pinpoint-location">
         Level: ${Math.round(value)}
       </div>`
    }
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

const mapStateToProps = state => {
  const { currentUser, sites } = state,
        { aqiScales, isFetchingAqiScales } = state.aqiScales,
        user = currentUser.user || utils.auth.getUser(),
        aqiScale = utils.aqiScaleTools.getUserAqiScale(aqiScales, user);

  var aqiThresholds = [], gaugeStyles = null;
  if (aqiScale) {
    var extraCheck = utils.aqiScaleTools.extraChecks(aqiScale.abbreviation), extended = true;
    aqiThresholds = utils.charts.parseScale(aqiScale, 'aqi', extraCheck, extended);
    gaugeStyles = utils.aqiScaleTools.prepareThresholdsForGauge(aqiThresholds);
  }

  return {
    markers: sites.sites.map(site => {
      let extraInfo = getSiteExtraData(site, aqiScale, gaugeStyles);
      site.iconUrl = extraInfo.icon;
      site.infowindowText = extraInfo.infowindowText;
      return site;
    }),
    paths: [],
    polygons: [],
    apiKey: process.env.REACT_APP_GOOGLE_API_KEY, 
    keyField: 'site_id',
    extraMapStyles: {
        'borderBottomLeftRadius': '4px',
        'borderBottomRightRadius': '4px'
    },
    isFetchingData: sites.isFetchingSites || isFetchingAqiScales
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
