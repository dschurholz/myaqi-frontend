
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';

const constants = {
    auEPABgColors: [
        'rgba(51, 153, 102, 0.2)', //VG
        'rgba(51, 153, 255, 0.2)', //G
        'rgba(255, 255, 0, 0.2)',  //F
        'rgba(255, 0, 0, 0.2)',    //P
        'rgba(0, 0, 0, 0.2)',      //VP 
    ]
};
const auEPAUpperLimits = [34, 67, 100, 150];

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
    backgroundColors: function (val, bgColors=constants.auEPABgColors, upperLimits=auEPAUpperLimits) {
      for (let i in upperLimits) {
        let ul = upperLimits[i];
        if (val < ul){
          return bgColors[i];
        }
      }
      return bgColors[bgColors.length-1];
    },
    createColorSeparators: function (topVal, upperLimits=auEPAUpperLimits) {
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
    if (chart.config.options.chartArea && chart.config.options.chartArea.backgroundColors && chart.config.options.chartArea.createColorSeparators) {
      var ctx = chart.chart.ctx;
      var chartArea = chart.chartArea;
      var yScale = chart.scales['y-axis-0'],
          highestTick = yScale.ticksAsNumbers[0],
          backColors = chart.config.options.chartArea.backgroundColors,
          separators = chart.config.options.chartArea.createColorSeparators(highestTick);

      ctx.save();
      for (let i = 0; i < separators.steps.length; i++) {
        ctx.fillStyle = backColors(separators.colors[i]);
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