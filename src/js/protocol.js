"use strict";

function parser(data, method, callback) {
    const obj = JSON.parse(data);
    const res = obj[obj.method];
    if (obj.method === method) {
        callback(res);
    }
    return res;
}

function toObjJson(v, method) {
    const value = {
        "method": method
    };
    value[method] = v;
    return JSON.stringify(value);
}

function toMove(n) {
    return toObjJson(n, "move");
}

function toField(field) {
    return toObjJson(field, "field");
}

export default {parser, toMove, toField};
