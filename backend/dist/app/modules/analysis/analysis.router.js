"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalysisRouter = void 0;
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = __importDefault(require("../../middleware/auth.middleware"));
const user_1 = require("../../../enums/user");
const analysis_controller_1 = require("./analysis.controller");
const router = express_1.default.Router();
// Route to get dashboard analysis
router.get("/dashboard", (0, auth_middleware_1.default)(user_1.ENUM_USER_ROLE.USER, user_1.ENUM_USER_ROLE.WRITER, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), analysis_controller_1.AnalysisController.getDashboardAnalysis);
exports.AnalysisRouter = router;
