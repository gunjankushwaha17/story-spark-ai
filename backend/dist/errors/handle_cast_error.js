"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleCastError = (err) => {
    const statusCode = 500;
    const errors = [
        {
            path: err.path,
            message: "Invalid Id",
        },
    ];
    return {
        statusCode,
        message: err.name,
        errorMessages: errors,
    };
};
exports.default = handleCastError;
