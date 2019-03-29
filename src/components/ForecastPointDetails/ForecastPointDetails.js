// ForecastPointDetails.js

import { connect } from 'react-redux';
import ForecastDetails from '../ForecastDetails';
import * as moment from 'moment';

function parseWeatherbitForecasts (forecasts) {
  var pollutants = {
        'aqi': {
          data: [],
          color: 'rgba(75,192,192'
        },
        'so2': {
          data: [],
          color: 'rgba(192,75,192'
        },
        'no2': {
          data: [],
          color: 'rgba(192,192,75'
        },
        'co': {
          data: [],
          color: 'rgba(75,75,192'
        },
        'pm25': {
          data: [],
          color: 'rgba(75,192,75'
        },
        'pm10': {
          data: [],
          color: 'rgba(192,75,75'
        },
        'o3': {
          data: [],
          color: 'rgba(75,127,192'
        }
      },
      results = {
        cityName: forecasts.city_name || "Unkown",
        timeZone: forecasts.timezone || "Unkown",
        country: forecasts.country_code || "Unkown",
        data: []
    },
    labels = [];

  forecasts.data.forEach((forecast, index) => {
    pollutants['aqi'].data.push(forecast['aqi']);
    pollutants['so2'].data.push(forecast['so2']);
    pollutants['no2'].data.push(forecast['no2']);
    pollutants['co'].data.push(forecast['co']);
    pollutants['pm25'].data.push(forecast['pm25']);
    pollutants['pm10'].data.push(forecast['pm10']);
    pollutants['o3'].data.push(forecast['o3']);
    labels.push(moment(forecast['timestamp_local']).format("dd Do, HHA"));
  });

  Object.keys(pollutants).forEach(pollutant => {
    results.data.push({
      pollutantName: pollutant.toUpperCase(),
      data: {
        labels: labels,
        datasets: [
          {
            label: pollutant.toUpperCase(),
            fill: false,
            lineTension: 0.1,
            backgroundColor: pollutants[pollutant].color + ',0.4)',
            borderColor: pollutants[pollutant].color + ',1)',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(75,192,192,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: pollutants[pollutant].data,
          },
        ]
      }
    });
  });

  return results;
}

const mapStateToProps = state => {
  var forecasts = (state.aqiForecasts.forecasts.data && state.aqiForecasts.forecasts.data.length > 0) ? parseWeatherbitForecasts(state.aqiForecasts.forecasts): [];
  return {
    forecasts: forecasts,
    isFetchingAqiForecasts: state.aqiForecasts.isFetchingAqiForecasts
  };
};

export default connect(
  mapStateToProps,
  null
)(ForecastDetails);