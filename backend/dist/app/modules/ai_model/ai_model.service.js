"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiModelService = void 0;
const api_error_1 = __importDefault(require("../../../errors/api_error"));
const timeout_limit_1 = require("../../../utils/timeout_limit");
const user_model_1 = require("../user/user.model");
const ai_model_utils_1 = require("./ai_model.utils");
const http_status_1 = __importDefault(require("http-status"));
const aiModelGenerate = (payload, token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = token;
        const { prompt, wordLength, numStories } = payload;
        const result = yield Promise.race([
            (0, timeout_limit_1.timeoutLimit)(60000),
            (0, ai_model_utils_1.generateWithGeminiStories)(prompt, wordLength, numStories),
        ]);
        if (result) {
            const user = yield user_model_1.User.findOne({ email: email });
            if (!user) {
                throw new api_error_1.default(http_status_1.default.BAD_REQUEST, "User not found!");
            }
            const currentDate = new Date();
            const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
            if (user.lastRequestDate && user.lastRequestDate < firstDayOfMonth) {
                user.requestsThisMonth = 0;
                user.lastRequestDate = currentDate;
            }
            user.requestsThisMonth += 1;
            user.lastRequestDate = currentDate;
            yield user.save();
        }
        return result;
    }
    catch (error) {
        throw new api_error_1.default(http_status_1.default.GATEWAY_TIMEOUT, "Request timed out!");
    }
});
const aiFreeModelGenerate = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { prompt } = payload;
        const result = yield Promise.race([
            (0, timeout_limit_1.timeoutLimit)(10000),
            (0, ai_model_utils_1.generateWithGeminiStories)(prompt, 150),
        ]);
        return result;
    }
    catch (error) {
        throw new api_error_1.default(http_status_1.default.GATEWAY_TIMEOUT, "Request timed out!");
    }
});
exports.AiModelService = {
    aiModelGenerate,
    aiFreeModelGenerate,
};
