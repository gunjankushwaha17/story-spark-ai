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
exports.generateStories = generateStories;
const openai_1 = __importDefault(require("openai"));
const config_1 = __importDefault(require("../../../config"));
const image_generation_1 = require("../../../utils/image_generation");
const openai = new openai_1.default({
    apiKey: config_1.default.openai_key,
});
function generateStories(prompt) {
    return __awaiter(this, void 0, void 0, function* () {
        const completion = yield openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: "You are a creative writer. Generate a JSON array of stories. Each story should have a title, content (around 400 words), and a tag. Format the output as a JSON array.",
                },
                {
                    role: "user",
                    content: `Generate 4 different stories based on the following prompt: ${prompt}. Each story should have a title, content, and a tag. Return the output as a JSON array.`,
                },
            ],
            response_format: { type: "json_object" },
        });
        const stories = JSON.parse(completion.choices[0].message.content).stories;
        for (const story of stories) {
            story.imageURL = yield (0, image_generation_1.fetchImageURL)(story.tag);
        }
        return stories;
    });
}
