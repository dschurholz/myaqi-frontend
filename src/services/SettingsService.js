import { localStore } from './index';

export default {
    getSettings: getSettings,
    updateSettings: updateSettings,
    removeSettings: removeSettings
};

function getSettings() {
    let settings = JSON.parse(localStore.getItem('global-settings'));
    return settings? settings : {};
}

function updateSettings(settings) {
    localStore.setItem('global-settings', JSON.stringify(settings));
    return settings;
}

function removeSettings() {
    return localStore.removeItem('global-settings');
}
