// tools.js

const isObject = function(a) {
    return (!!a) && (a.constructor === Object);
};

export default {
    camelCameToUnderscore: camelCameToUnderscore,
    cloneObject: cloneObject,
    hexToRgb: hexToRgb,
    hexToRgba: hexToRgba
};

function camelCameToUnderscore(obj) {
    const keys = Object.keys(obj);
    var newObj = {};
    for (let key in keys) {
        let newKey = keys[key].replace(/([A-Z])/g, function (x,y){return "_" + y.toLowerCase()}).replace(/^_/, "");
        newObj[newKey] = !isObject(obj[keys[key]]) ? obj[keys[key]] : camelCameToUnderscore(obj[keys[key]]);
    }
    return newObj;
};

function cloneObject(src) {
    let target = {};
    for (let prop in src) {
        if (src.hasOwnProperty(prop)) {
            if (isObject(src[prop])) {
                target[prop] = cloneObject(src[prop]);
            } else {
                target[prop] = src[prop];
            }
        }
    }
    return target;
};

function _hexToRgb (hex) { 
    return parseInt(hex, 16);
};

function hexToRgb (hex) {
    var rgb = hex;
    if (rgb[0] === '#') {
        rgb = rgb.split('#')[0];
    }
    if (rgb.length === 3) {
        rgb = `rgb(${_hexToRgb(rgb[0])},${_hexToRgb(rgb[1])},${_hexToRgb(rgb[2])})`;
    } else if (rgb.length === 6) {
        rgb = `rgb(${_hexToRgb(rgb.substr(0, 2))},${_hexToRgb(rgb.substr(2, 4))},${_hexToRgb(rgb.substr(4, 6))})`;
    }
    return rgb;
};

function hexToRgba (hex, alpha) {
    var rgba = hex;
    if (rgba[0] === '#') {
        rgba = rgba.split('#')[1];
    }
    if (rgba.length === 3) {
        rgba = `rgba(${_hexToRgb(rgba[0])},${_hexToRgb(rgba[1])},${_hexToRgb(rgba[2])},${alpha})`;
    } else if (rgba.length === 6) {
        rgba = `rgba(${_hexToRgb(rgba.substr(0, 2))},${_hexToRgb(rgba.substr(2, 4))},${_hexToRgb(rgba.substr(4, 6))},${alpha})`;
    }

    return rgba;
};
