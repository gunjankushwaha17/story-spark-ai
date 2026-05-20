"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.timeoutLimit = void 0;
const timeoutLimit = (timeLimit) => {
    return new Promise((_, reject) => setTimeout(() => reject(new Error()), timeLimit));
};
exports.timeoutLimit = timeoutLimit;
