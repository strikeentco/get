'use strict';

const isObject = val => Object.prototype.toString.call(val) === '[object Object]';
const get = (obj, parts, length) => {
  for (let i = 0; i < length; i++) {
    if (obj === null) {
      return;
    }
    const v = obj[parts[i]];
    if (v === undefined) {
      return;
    }
    obj = v;
  }
  return obj;
};

module.exports = (obj, path, sep = '.') => {
  if (!isObject(obj) || !path) {
    return obj;
  }
  const parts = Array.isArray(path) ? path : String(path).split(sep);
  const { length } = parts;
  return length < 2 ? obj[parts[0]] : get(obj, parts, length);
};
