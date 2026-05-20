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
exports.AiModelController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catch_async_1 = __importDefault(require("../../../shared/catch_async"));
const send_response_1 = __importDefault(require("../../../shared/send_response"));
const ai_model_service_1 = require("./ai_model.service");
const token_1 = require("../../middleware/token");
const storyGenerationCounts = {};
const aiModelGenerate = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const prompt = req.body;
    const token = yield (0, token_1.getToken)(req);
    const result = yield ai_model_service_1.AiModelService.aiModelGenerate(prompt, token);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Stories generated successfully!",
        data: result,
    });
}));
const aiFreeModelGenerate = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const prompt = req.body;
    let userId = req.cookies.userId;
    // If no cookie exists, generate a unique ID and set it in a cookie
    if (!userId) {
        userId = Math.random().toString(36).substring(7);
        res.cookie("userId", userId, { maxAge: 30 * 24 * 60 * 60 * 1000 });
    }
    // Initialize or get the current count for the user
    if (!storyGenerationCounts[userId]) {
        storyGenerationCounts[userId] = 0;
    }
    if (storyGenerationCounts[userId] > 3) {
        return (0, send_response_1.default)(res, {
            statusCode: http_status_1.default.FORBIDDEN,
            success: false,
            message: "You have reached the maximum limit of 3 story generations.",
        });
    }
    const result = yield ai_model_service_1.AiModelService.aiFreeModelGenerate(prompt);
    storyGenerationCounts[userId] += 1;
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Story generated successfully!",
        data: result,
    });
}));
exports.AiModelController = {
    aiModelGenerate,
    aiFreeModelGenerate,
};
