// SiteMap.js

import { connect } from 'react-redux';
import GoogleMap from '../GoogleMap';
import { siteSelected } from '../../actions';

import { utils } from '../../utils';

import { SettingsService } from '../../services';

function getSiteExtraData(site, gaugeStyles) {
  const { gaugeTheme } = SettingsService.getSettings();

  if (!site.current_status || site.current_status.length === 0) {
    return {
      icon: 'data:image/svg+xml;utf-8,' + utils.svgIcons.getGaugeIcon(gaugeTheme),
      infowindowText: null
    }
  }

  let icon;
  for (let s in site.current_status) {
    let monitor = site.current_status[s];
    if (monitor.name === "AQI" || monitor.name === "Summary") {
      if (gaugeStyles) {
        icon = utils.svgIcons.getGaugeIcon(gaugeTheme, monitor.value, gaugeStyles.limits, gaugeStyles.colors);
      } else {
        icon = utils.svgIcons.getGaugeIcon(gaugeTheme, monitor.value);
      }
      return {
        icon: 'data:image/svg+xml;utf-8,' + icon,
        infowindowText: `
         <h4>${site.name}</h4>
         <div>
            Air quality is ${monitor.description}
         </div>
         <div class="pinpoint-location">
           Level: ${Math.round(monitor.value)}
         </div>`
        }
    }
  };

  
  if (gaugeStyles) {
    icon = utils.svgIcons.getGaugeIcon(gaugeTheme, site.current_status[0].aqi_value, gaugeStyles.limits, gaugeStyles.colors);
  } else {
    icon = utils.svgIcons.getGaugeIcon(gaugeTheme, site.current_status[0].aqi_value);
  }
  return {
    icon: 'data:image/svg+xml;utf-8,' + icon,
    infowindowText: `
     <h4>${site.name}</h4>
     <div class="pinpoint-location">
        Air quality is ${site.current_status[0].description}
     </div>
     <div class="pinpoint-location">
      Level: ${Math.round(site.current_status[0].value)}
     </div>`
  }
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
      let extraInfo = getSiteExtraData(site, gaugeStyles);
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
