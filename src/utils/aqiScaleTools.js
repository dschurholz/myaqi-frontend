// aqiScaleTools.js

import { parseScale } from './charts';

const POLLUTANTS = ['aqi', 'pm2.5', 'pm10', 'no2', 'o3', 'so2', 'co'];
const WEATHER_VARIABLES = ['rh', 'temp', 'wspeed', 'wdir']

export default {
    POLLUTANTS,
    WEATHER_VARIABLES,
    normalizePollutantId: normalizePollutantId,
    extraChecks: extraChecks,
    getUserAqiScale: getUserAqiScale,
    parseAqiScale: parseAqiScale,
    parseAqiScaleAllPollutantsStyles:parseAqiScaleAllPollutantsStyles,
    parseScaleAllPollutants: parseScaleAllPollutants,
    sortMeasurementsArray: sortMeasurementsArray,
    prepareThresholdsForGauge,
    sortPollutantsArray,
    sensitivityChecks
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

function sensitivityChecks(aqiIndex, sensitivityLevel, aqiScaleId) {
  switch (aqiScaleId) {
    case 'EUEEA':
    case 'USEPA':
    case 'AUEPA':
      if(aqiIndex<=33) {
        return 0;
      }
      else if(aqiIndex>33 && aqiIndex <=66) {
        if(sensitivityLevel === 0) {
          return 0;
        }
        else {
          return 1;
        }
      }
      else if(aqiIndex>66 && aqiIndex<=99){
        if(sensitivityLevel === 0 || sensitivityLevel === 1) {
          return 1;
        }
        else if(sensitivityLevel === 2 || sensitivityLevel === 3){
          return 2;
        }
        else {
          return 3;
        }
      }
      else if(aqiIndex>99 && aqiIndex<=149){
        if(sensitivityLevel === 3) {
          return 3;
        }
        else if(sensitivityLevel === 4) {
          return 4;
        }
        else {
          return 2;
        }
      }
      else if(aqiIndex>149) {
        if(sensitivityLevel === 3 || sensitivityLevel==4){
          return 4;
        }
        else {
          return 3;
        }
      }
    default:
      return 0;
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

function parseAqiScaleAllPollutantsStyles (aqiScale=null) {
  if (!aqiScale) return null;

  var pollutantsStyles = {};
  for (let p in POLLUTANTS) {
    pollutantsStyles[POLLUTANTS[p]] = parseAqiScale(POLLUTANTS[p], aqiScale);
  }

  return pollutantsStyles;
}

function getPollutantsForScale (aqiScale) {
  let pollutants = []
  aqiScale.aqi_category_thresholds.forEach(thresh => {
    if (!pollutants.includes(thresh.pollutant)) {
      pollutants.push(thresh.pollutant);
    }
  });

  return pollutants;
}

function parseScaleAllPollutants (aqiScale=null) {
  if (!aqiScale) return null;

  const pollutants = getPollutantsForScale(aqiScale),
        extraCheck = extraChecks(aqiScale.abbreviation),
        extended = true;
  var parsedPollutants = {};
  for (let p in pollutants) {
    parsedPollutants[pollutants[p]] = parseScale(aqiScale, pollutants[p], extraCheck, extended);
  }

  return parsedPollutants;
}

function sortPollutantsArray (array, withWeatherVars=false) {
  var wholeKeys = (withWeatherVars) ? POLLUTANTS.concat(WEATHER_VARIABLES) : POLLUTANTS;
  const arr = array.sort((el1, el2) => {
    let el1idx = wholeKeys.indexOf(el1.toLowerCase()),
        el2idx = wholeKeys.indexOf(el2.toLowerCase());
    el1idx = el1idx > -1 ? el1idx : 999999;
    el2idx = el2idx > -1 ? el2idx : 999999;
    if (el1idx > el2idx) return 1;
    if (el2idx > el1idx) return -1;
    return 0;
  });
  return arr;
}

function sortMeasurementsArray (array) {
  const wholeKeys = POLLUTANTS.concat(WEATHER_VARIABLES);
  const arr = array.sort((el1, el2) => {
    const el1idx = wholeKeys.indexOf(Object.keys(el1)[0].toLowerCase()),
          el2idx = wholeKeys.indexOf(Object.keys(el2)[0].toLowerCase())
    if (el1idx > el2idx) return 1;
    if (el2idx > el1idx) return -1;
    return 0;
  });
  return arr;
}

function prepareThresholdsForGauge (aqiThresholds) {
  let thresholds = { colors: [], limits: []};
  if (aqiThresholds && aqiThresholds.upperLimits && aqiThresholds.backgroundColors) {
    thresholds.colors = aqiThresholds.backgroundColors.slice(0);
    thresholds.limits = aqiThresholds.upperLimits.slice(0);
    thresholds.limits.pop();
    if (thresholds.limits.length === 4) {
      thresholds.limits.push(thresholds.limits[thresholds.limits.length-1] * 2);
    }
    thresholds.limits.push(1000);
    thresholds.limits.unshift(0);
    if (thresholds.colors.length === 5) {
      thresholds.colors.push(thresholds.colors[thresholds.colors.length-1]);
    }
  }
  return thresholds;
}
