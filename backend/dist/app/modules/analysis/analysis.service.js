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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalysisService = void 0;
const subscription_type_1 = require("../../../enums/subscription_type");
const user_1 = require("../../../enums/user");
const user_status_1 = require("../../../enums/user_status");
const post_model_1 = require("../post/post.model");
const user_model_1 = require("../user/user.model");
const getDashboardAnalysis = () => __awaiter(void 0, void 0, void 0, function* () {
    // get all users
    const users = yield user_model_1.User.find({});
    const totalUsers = users.length;
    const activeUsers = users.filter((u) => u.status === user_status_1.USER_STATUS.ACTIVE).length;
    const inactiveUsers = users.filter((u) => u.status === user_status_1.USER_STATUS.INACTIVE).length;
    const blockedUsers = users.filter((u) => u.status === user_status_1.USER_STATUS.BLOCKED).length;
    const writers = users.filter((u) => u.role === user_1.ENUM_USER_ROLE.WRITER).length;
    const applyForWriter = users.filter((u) => u.isApplyForWriter === true).length;
    // user subscription types
    const freeUsers = users.filter((u) => u.subscriptionType === subscription_type_1.SUBSCRIPTION_TYPE.FREE).length;
    const proUsers = users.filter((u) => u.subscriptionType === subscription_type_1.SUBSCRIPTION_TYPE.PRO).length;
    const premiumUsers = users.filter((u) => u.subscriptionType === subscription_type_1.SUBSCRIPTION_TYPE.PREMIUM).length;
    // get all posts
    const posts = yield post_model_1.Post.find({});
    const totalPosts = posts.length;
    const publishedPosts = posts.filter((p) => p.isPublished).length;
    const featuredPosts = posts.filter((p) => p.isFeaturedPost).length;
    const postsPerMonth = {};
    posts.forEach((post) => {
        var _a;
        const month = (_a = post === null || post === void 0 ? void 0 : post.publishedAt) === null || _a === void 0 ? void 0 : _a.toISOString().substring(0, 7);
        if (month) {
            postsPerMonth[month] = (postsPerMonth[month] || 0) + 1;
        }
    });
    const topicCount = {};
    posts.forEach((post) => {
        post.topic.forEach((t) => {
            topicCount[t.title] = (topicCount[t.title] || 0) + 1;
        });
    });
    return {
        users: {
            total: totalUsers,
            active: activeUsers,
            inactive: inactiveUsers,
            blocked: blockedUsers,
            writers: writers,
            applyForWriter: applyForWriter,
        },
        subscriptionTypes: {
            free: freeUsers,
            pro: proUsers,
            premium: premiumUsers,
        },
        posts: {
            total: totalPosts,
            published: publishedPosts,
            featured: featuredPosts,
            perMonth: postsPerMonth,
            topics: topicCount,
        },
    };
});
exports.AnalysisService = {
    getDashboardAnalysis,
};
