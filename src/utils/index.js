import { svgIcons } from './svgIcons';
import { MapLoader, BulletList, TableLoader } from './loaders';
import { aqiDefaultOptions, aqiBeforeDrawPlugin, parseScale } from './charts';
import { history } from './history';
import { authHeader, getUser, setUser, removeUser, getAuthToken, setAuthToken, removeAuthToken } from './auth';
import aqiScaleTools from './aqiScaleTools';
import tools from './tools';

export const utils = {
    svgIcons: svgIcons,
    loaders: {
        MapLoader: MapLoader,
        BulletList: BulletList,
        TableLoader: TableLoader
    },
    charts: {
        aqiDefaultOptions: aqiDefaultOptions,
        aqiBeforeDrawPlugin: aqiBeforeDrawPlugin,
        parseScale: parseScale
    },
    history: history,
    auth: {
        authHeader: authHeader,
        getUser: getUser,
        setUser: setUser,
        removeUser:removeUser,
        getAuthToken: getAuthToken,
        setAuthToken: setAuthToken,
        removeAuthToken: removeAuthToken,
    },
    aqiScaleTools: aqiScaleTools,
    tools: tools,
};