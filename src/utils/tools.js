// tools.js

const isObject = function(a) {
    return (!!a) && (a.constructor === Object);
};

export default {
    camelCameToUnderscore: camelCameToUnderscore,
    cloneObject: cloneObject
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
