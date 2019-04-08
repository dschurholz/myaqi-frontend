// SiteMap.js

import { connect } from 'react-redux';
import GoogleMap from '../GoogleMap';
import { siteSelected } from '../../actions';

import { utils } from '../../utils';


function getSiteExtraData(site) {
  if (!site.current_status || site.current_status.length === 0) {
    return {
      icon: 'data:image/svg+xml;utf-8,' + utils.svgIcons.getGaugeIcon("light"),
      infowindowText: null
    }
  }

  site.current_status.forEach(monitor => {
    if (monitor.name === "AQI" || monitor.name === "Summary") {
      return {
        icon: 'data:image/svg+xml;utf-8,' + utils.svgIcons.getGaugeIcon("light", monitor.value),
        infowindowText: `<h4>
           Air quality is ${monitor.description}
         </h4>
         <div class="pinpoint-location">
          Level: ${Math.round(monitor.value)}
         </div>`
        }
    }
  });

  return {
    icon: 'data:image/svg+xml;utf-8,' + utils.svgIcons.getGaugeIcon("light", site.current_status[0].aqi_value),
    infowindowText: `<h4>
       Air quality is ${site.current_status[0].description}
     </h4>
     <div class="pinpoint-location">
      Level: ${Math.round(site.current_status[0].value)}
     </div>`
  }
}

const mapStateToProps = state => {

  return {
    markers: state.sites.sites.map(site => {
      let extraInfo = getSiteExtraData(site);
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
    isFetchingData: state.sites.isFetchingSites
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
