import React from 'react';
import DefaultLayout from './containers/DefaultLayout';

const Dashboard = React.lazy(() => import('./views/Dashboard'));
const AQIMap = React.lazy(() => import('./views/AQIMap'));
const AQIForecastMap = React.lazy(() => import('./views/AQIForecastMap'));
const Traffic = React.lazy(() => import('./views/Traffic'));
const Fires = React.lazy(() => import('./views/Fires'));
const CurrentProgress = React.lazy(() => import('./views/CurrentProgress'));

// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  { path: '/', exact: true, name: 'Home', component: DefaultLayout },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/map', name: 'AQIMap', component: AQIMap },
  { path: '/aqiForecasts', name: 'AQIForecastMap', component: AQIForecastMap },
  { path: '/traffic', name: 'Traffic', component: Traffic },
  { path: '/fires', name: 'Fires', component: Fires },
  { path: '/tesis-progress/current', name: 'CurrentProgress', component: CurrentProgress }
];

export default routes;
