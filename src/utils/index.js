import { svgIcons } from './svgIcons';
import { MapLoader, BulletList, TableLoader } from './loaders';
import { aqiDefaultOptions, aqiBeforeDrawPlugin } from './charts';
import { history } from './history';
import { authHeader } from './auth';

export const utils = {
    svgIcons: svgIcons,
    loaders: {
        MapLoader: MapLoader,
        BulletList: BulletList,
        TableLoader: TableLoader
    },
    charts: {
        aqiDefaultOptions: aqiDefaultOptions,
        aqiBeforeDrawPlugin: aqiBeforeDrawPlugin
    },
    history: history,
    auth: {
        authHeader: authHeader
    }
};