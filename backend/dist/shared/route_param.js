"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routeParam = void 0;
/** Express may type `req.params` values as `string | string[]` — normalize for services. */
const routeParam = (value) => {
    var _a;
    if (value === undefined)
        return "";
    return Array.isArray(value) ? ((_a = value[0]) !== null && _a !== void 0 ? _a : "") : value;
};
exports.routeParam = routeParam;
