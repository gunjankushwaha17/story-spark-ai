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
const http_status_1 = __importDefault(require("http-status"));
const user_model_1 = require("../modules/user/user.model");
const ai_model_request_limit_1 = require("../../interfaces/ai_model_request_limit");
const api_error_1 = __importDefault(require("../../errors/api_error"));
const jwt_helper_1 = require("../../utils/jwt.helper");
const config_1 = __importDefault(require("../../config"));
const checkRequestLimit = () => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.headers.authorization;
        if (!token) {
            throw new api_error_1.default(http_status_1.default.UNAUTHORIZED, "You are not authorized to access");
        }
        const verifiedUser = yield jwt_helper_1.JwtHalers.verifyToken(token, config_1.default.jwt.secret);
        const { email: userEmail } = verifiedUser;
        const user = yield user_model_1.User.findOne({ email: userEmail });
        if (!user) {
            throw new api_error_1.default(http_status_1.default.BAD_REQUEST, "User not found!");
        }
        const currentDate = new Date();
        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        // Reset the request count if the last request was in a previous month
        if (user.lastRequestDate && user.lastRequestDate < firstDayOfMonth) {
            user.requestsThisMonth = 0;
            user.lastRequestDate = currentDate;
        }
        const requestLimit = ai_model_request_limit_1.REQUEST_LIMITS[user.subscriptionType];
        // Check if the user has exceeded their monthly limit
        if (user.requestsThisMonth >= requestLimit) {
            throw new api_error_1.default(http_status_1.default.CONFLICT, "Monthly request limit exceeded!");
        }
        next();
    }
    catch (err) {
        next(err);
    }
});
exports.default = checkRequestLimit;
