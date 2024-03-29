import { svgIcons } from './svgIcons';
import loaders from './loaders';
import * as charts from './charts';
import { history } from './history';
import * as auth from './auth';
import * as visTools from './visTools';
import aqiScaleTools from './aqiScaleTools';
import trafficFlowTools from './trafficFlowTools';
import fireTools from './fireTools';
import tools from './tools';

export const utils = {
    loaders,
    svgIcons: svgIcons,
    charts,
    history: history,
    auth: {
        ...auth
    },
    aqiScaleTools: aqiScaleTools,
    tools: tools,
    trafficFlowTools: trafficFlowTools,
    fireTools: fireTools,
    visTools: visTools
};