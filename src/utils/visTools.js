
import aqiScaleTools from './aqiScaleTools';
import { svgIcons } from './svgIcons';
import { SettingsService } from '../services';

export const GAUGES = 'Gauges';
export const PINS = 'Pins';
export const PINS_TEXT = 'Pins + Text';
export const HEATMAPS = 'Heatmaps';
export const HOTSPOTS = 'Hotspots';
export const POINT_VISUALISATION_TOOLS = [GAUGES, PINS, PINS_TEXT];
export const HEATMAP_VISUALISATION_TOOLS = [HEATMAPS, HOTSPOTS];

export var getGaugeStyle = (thresholds, val) => {
  const { gaugeTheme } = SettingsService.getSettings();
  const gaugeThresh = aqiScaleTools.prepareThresholdsForGauge(thresholds);
  return 'data:image/svg+xml;utf-8,' + svgIcons.getGaugeIcon(gaugeTheme, val, gaugeThresh.limits, gaugeThresh.colors);
}

export const getMapIcon = (markerType, abbrv, bgColor, fgColor, aqiScaleThresholds=null, val=0) => {
  switch (markerType) {
    case GAUGES:
      return {
        iconUrl: getGaugeStyle(aqiScaleThresholds, val),
      };
    case PINS_TEXT:
      return {
        iconUrl: `https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=${abbrv}|${bgColor.split('#')[1]}|${fgColor.split('#')[1]}`,
      };
    case PINS:
      return {
        icon: {
          path: 'M0-48c-9.8 0-17.7 7.8-17.7 17.4 0 15.5 17.7 30.6 17.7 30.6s17.7-15.4 17.7-30.6c0-9.6-7.9-17.4-17.7-17.4z',
          fillColor: bgColor,
          fillOpacity: 0.8,
          scale: 1,
          strokeOpacity: 0.2
        }
      };
    default:
      return {
        icon: {
          url: 'data:image/svg+xml;utf-8,' + svgIcons.getTransparentIcon(32, 32),
          anchor: true
        }
      }
  }
}

export const getDefaultIcon = () => {
  const { gaugeTheme } = SettingsService.getSettings();
  return {
    iconUrl: 'data:image/svg+xml;utf-8,' + svgIcons.getGaugeIcon(gaugeTheme, 15)
  }
}