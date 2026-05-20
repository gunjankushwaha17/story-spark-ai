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
exports.fetchImageURL = fetchImageURL;
const config_1 = __importDefault(require("../config"));
const api_error_1 = __importDefault(require("../errors/api_error"));
const http_status_1 = __importDefault(require("http-status"));
function fetchImageURL(prompt) {
    return __awaiter(this, void 0, void 0, function* () {
        const accessKey = config_1.default.unsplash_key_api;
        const url = `https://api.unsplash.com/search/photos?page=1&query=${encodeURIComponent(prompt)}&client_id=${accessKey}`;
        try {
            const response = yield fetch(url);
            if (!response.ok)
                throw new api_error_1.default(http_status_1.default.NOT_FOUND, `HTTP error! Status: ${response.status}`);
            const data = yield response.json();
            return {
                imageUrl: data.results.length > 0
                    ? data.results[0].urls.regular
                    : "https://via.placeholder.com/400",
            };
        }
        catch (error) {
            return { imageUrl: "https://via.placeholder.com/400" };
        }
    });
}
