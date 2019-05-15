import { svgIcons } from './svgIcons';
import loaders from './loaders';
import * as charts from './charts';
import { history } from './history';
import * as auth from './auth';
import aqiScaleTools from './aqiScaleTools';
import trafficFlowTools from './trafficFlowTools';
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
    trafficFlowTools: trafficFlowTools
};