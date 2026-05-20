"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIModelValidator = void 0;
const zod_1 = require("zod");
const aiModel = zod_1.z.object({
    body: zod_1.z.object({
        prompt: zod_1.z.string({ required_error: "Prompt is required!" }),
    }),
});
exports.AIModelValidator = {
    aiModel,
};
