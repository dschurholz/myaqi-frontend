import { svgIcons } from './svgIcons';

const CIRCLE_COLORS = ["#6BFF2A", "#C2FF2A", "#FFF22A", "#FFB22A", "#FF372A"];

var getFireStyles = (fire) => {
  if(fire.fire_svrty.startsWith("BURNT_5"))
    return {color: "#333333", icon: 'data:image/svg+xml;utf-8,' + svgIcons.getFireIcon("markers--incident--Fire_Active")};
  if(fire.fire_svrty.startsWith("BURNT_4"))
    return {color: "red", icon: 'data:image/svg+xml;utf-8,' + svgIcons.getFireIcon("markers--warning--Emergency_Warning")};
  if(fire.fire_svrty.startsWith("BURNT_3"))
    return {color: "orange", icon: 'data:image/svg+xml;utf-8,' + svgIcons.getFireIcon("markers--incident--Fire")};
  if(fire.fire_svrty.startsWith("BURNT_2"))
    return {color: "yellow", icon: 'data:image/svg+xml;utf-8,' + svgIcons.getFireIcon("markers--incident--Fire")};
  return {color: "blue", icon: 'data:image/svg+xml;utf-8,' + svgIcons.getFireIcon("markers--incident--Fire")};
};

var getFireAreaColor = (index) => {
    return CIRCLE_COLORS[index];
};

export default {
    getFireStyles,
    getFireAreaColor
}