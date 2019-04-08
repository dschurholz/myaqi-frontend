import React from 'react';
import DefaultLayout from './containers/DefaultLayout';

const Dashboard = React.lazy(() => import('./views/Dashboard'));
const AQIMap = React.lazy(() => import('./views/AQIMap'));
const AQIForecastMap = React.lazy(() => import('./views/AQIForecastMap'));
const Traffic = React.lazy(() => import('./views/Traffic'));
const Fires = React.lazy(() => import('./views/Fires'));
const CurrentProgress = React.lazy(() => import('./views/CurrentProgress'));
const Profile = React.lazy(() => import('./views/Profile'));
const Settings = React.lazy(() => import('./views/Settings'));

// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  { path: '/', exact: true, name: 'Home', component: DefaultLayout, routeType: 'private'},
  { path: '/dashboard', name: 'Dashboard', component: Dashboard, routeType: 'private' },
  { path: '/map', name: 'AQIMap', component: AQIMap, routeType: 'private' },
  { path: '/aqiForecasts', name: 'AQIForecastMap', component: AQIForecastMap, routeType: 'private' },
  { path: '/traffic', name: 'Traffic', component: Traffic, routeType: 'private' },
  { path: '/fires', name: 'Fires', component: Fires, routeType: 'private' },
  { path: '/tesis-progress/current', name: 'CurrentProgress', component: CurrentProgress, routeType: 'private' },
  { path: '/profile', exact: true, name: 'Profile', component: Profile, routeType: 'private' },
  { path: '/settings', exact: true, name: 'Settings', component: Settings, routeType: 'private' }
];

export default routes;
