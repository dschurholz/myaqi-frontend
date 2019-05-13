import { utils } from '../utils';
import axios from 'axios';
import { localStore } from './index';

export default {
    getSettings: getSettings,
    updateSettings: updateSettings,
    removeSettings: removeSettings
};

function getSettings() {
    let settings = JSON.parse(localStorage.getItem('global-settings'));
    return settings? settings : {};
}

function updateSettings(settings) {
    return localStorage.setItem('global-settings', JSON.stringify(settings));
}

function removeSettings() {
    return localStorage.removeItem('global-settings');
}
