"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIModelRouter = void 0;
const express_1 = __importDefault(require("express"));
const ai_model_controller_1 = require("./ai_model.controller");
const validate_request_1 = __importDefault(require("../../middleware/validate.request"));
const ai_model_validation_1 = require("./ai_model.validation");
const check_request_limit_1 = __importDefault(require("../../middleware/check.request.limit"));
const router = express_1.default.Router();
// Generate Model
router.post("/generate-model", (0, validate_request_1.default)(ai_model_validation_1.AIModelValidator.aiModel), (0, check_request_limit_1.default)(), ai_model_controller_1.AiModelController.aiModelGenerate);
// Generate Free Model
router.post("/generate-free-model", (0, validate_request_1.default)(ai_model_validation_1.AIModelValidator.aiModel), ai_model_controller_1.AiModelController.aiFreeModelGenerate);
exports.AIModelRouter = router;
