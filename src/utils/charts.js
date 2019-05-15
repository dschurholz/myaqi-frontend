
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';

const constants = {
  auEPABgColors: [
      'rgba(51, 153, 102, 0.2)', //VG
      'rgba(51, 153, 255, 0.2)', //G
      'rgba(255, 255, 0, 0.2)',  //F
      'rgba(255, 0, 0, 0.2)',    //P
      'rgba(0, 0, 0, 0.2)',      //VP 
  ],
  auEPAUpperLimits: [34, 67, 100, 150]
};

export const aqiDefaultOptions = {
  tooltips: {
    enabled: false,
    custom: CustomTooltips
  },
  scales: {
    yAxes: [{
      ticks: {
          beginAtZero: true
      }
    }]
  },
  maintainAspectRatio: true,
  chartArea: {
    backgroundColors: constants.auEPABgColors,
    upperLimits: constants.auEPAUpperLimits,
    setBackgroundColors: function (bgColors, upperLimits) {
      return function (val) {
        for (let i in upperLimits) {
          let ul = upperLimits[i];
          if (val < ul){
            return bgColors[i];
          }
        }
        return bgColors[bgColors.length-1];
      }
    },
    createColorSeparators: function (topVal, upperLimits) {
      var result = {
        colors: [],
        steps: []
      };
      for (let i in upperLimits) {
        let ul = upperLimits[i];
        if (topVal > ul){
          result.colors.unshift(ul-1);
          result.steps.unshift(ul/topVal);
        } else {
          break;
        }
      }
      result.colors.unshift(topVal);
      result.steps.unshift(1.0);
      return result;
    }
  }
};

export const aqiBeforeDrawPlugin = {
  beforeDraw: function (chart, easing) {
    if (chart.config.options.chartArea && chart.config.options.chartArea.setBackgroundColors && chart.config.options.chartArea.createColorSeparators) {
      var ctx = chart.chart.ctx;
      var chartArea = chart.chartArea;
      const yScale = chart.scales['y-axis-0'],
            highestTick = yScale.ticksAsNumbers[0],
            backColors = chart.config.options.chartArea.backgroundColors || constants.auEPABgColors,
            upperLimits = chart.config.options.chartArea.upperLimits || constants.auEPAUpperLimits,
            setBackColors = chart.config.options.chartArea.setBackgroundColors(
              backColors, upperLimits),
            separators = chart.config.options.chartArea.createColorSeparators(
              highestTick, upperLimits);

      ctx.save();
      for (let i = 0; i < separators.steps.length; i++) {
        ctx.globalAlpha = 0.2;
        ctx.fillStyle = setBackColors(separators.colors[i]);
        ctx.fillRect(
          chartArea.left,
          chartArea.top + (1.0 - separators.steps[i]) * yScale.height,
          chartArea.right - chartArea.left,
          ((i+1 < separators.steps.length)?(separators.steps[i] - separators.steps[i+1]):separators.steps[i])*yScale.height
        );
      }
      ctx.restore();
    }
  }
};

// Returns an object with upperLimits and backgroundColors as properties
export const parseScale = function (aqiScale, pollutant='aqi', extraCheck=null, extended=false) {
  var { aqi_category_thresholds } = aqiScale;
  var result = {
    backgroundColors: [],
    upperLimits: []
  };

  if (extended) {
    result.foregroundColors = [];
    result.abbreviations = [];
    result.descriptions = [];
    result.lowerLimits = [];
    result.units = '-';
  }

  aqi_category_thresholds.sort((thresh1, thresh2) => {
    if(thresh1.upper_threshold_value < thresh2.upper_threshold_value) return -1;
    if(thresh1.upper_threshold_value > thresh2.upper_threshold_value) return 1;
    return 0;
  }).forEach(thresh => {
    if (thresh.upper_threshold_value) {
      if (extraCheck && typeof extraCheck === 'function' && !extraCheck(thresh, pollutant)) {
        return;
      }
      if (thresh.units && result.units === '-') {
        result.units = thresh.units;
      }
      result.backgroundColors.push(thresh.background_colour);
      result.upperLimits.push(thresh.upper_threshold_value);
      if (extended) {
        result.foregroundColors.push(thresh.foreground_colour || '#000000');
        result.abbreviations.push(thresh.abbreviation);
        result.descriptions.push(thresh.description);
        result.lowerLimits.push(thresh.lower_threshold_value);
      }
    }
  });

  return result;
};

export const getMeasurementPollutantName = function (queryString) {
  const parseParamStart = 'MonitorId: ',
        parseParamEnd = 'TimeBasisId',
        parseParamStartLen = parseParamStart.length;
  return queryString.substr(queryString.indexOf(parseParamStart) + parseParamStartLen, queryString.indexOf(parseParamEnd)-(queryString.indexOf(parseParamStart) + parseParamStartLen) - 1);
}