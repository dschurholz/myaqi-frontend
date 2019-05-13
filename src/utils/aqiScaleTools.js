// aqiScaleTools.js

import { parseScale } from './charts';

export default {
    normalizePollutantId: normalizePollutantId,
    extraChecks: extraChecks,
    getUserAqiScale: getUserAqiScale,
    parseAqiScale: parseAqiScale,
    parseAqiScaleAllPollutants: parseAqiScaleAllPollutants
};

function normalizePollutantId(id) {
    switch (id.toLowerCase()) {
        case 'sp_aqi':
        case 'aqi':
            return 'aqi';
        case 'pm2.5':
        case 'bpm2.5':
        case 'ipm2.5':
        case 'pm25':
            return 'pm2.5';
        default:
            return id.toLowerCase();
    }
};

function extraChecks(aqiScaleId) {
    switch (aqiScaleId) {
        case 'EUEEA':
        case 'USEPA':
        case 'AUEPA':
            return (thresh, pollutant) => {
                return normalizePollutantId(thresh.pollutant) === normalizePollutantId(pollutant);
            };
        default:
            return null;
    }
}

function getUserAqiScale(aqiScales, user) {
    if (aqiScales.length > 0 && user.profile && user.profile.aqi_scale) {
      return aqiScales[aqiScales.findIndex(x => {
        return x.abbreviation === user.profile.aqi_scale;
      })];
    }
    return null;
}

function parseAqiScale (pollutant='aqi', aqiScale=null) {
  if (!aqiScale) return null;
  const extraCheck = extraChecks(aqiScale.abbreviation),
        extended = true,
        aqiThresholds = parseScale(aqiScale, pollutant, extraCheck, extended);

  return (val) => {
    let thresh;
    for (thresh in aqiThresholds.upperLimits) {
      if (val < aqiThresholds.upperLimits[thresh]) {
        break;
      }
    }
    return {
      bgColour: aqiThresholds.backgroundColors[thresh],
      description: aqiThresholds.descriptions[thresh],
      fgColour: aqiThresholds.foregroundColors[thresh],
      abbreviation: aqiThresholds.abbreviations[thresh]
    };
  }
}

function parseAqiScaleAllPollutants (aqiScale=null) {
  if (!aqiScale) return null;
  const POLLUTANTS = ['aqi', 'pm2.5', 'o3', 'pm10', 'so2', 'no2', 'co'];

  var pollutantsStyles = {};
  for (let p in POLLUTANTS) {
    pollutantsStyles[POLLUTANTS[p]] = parseAqiScale(POLLUTANTS[p], aqiScale);
  }

  return pollutantsStyles;
}
