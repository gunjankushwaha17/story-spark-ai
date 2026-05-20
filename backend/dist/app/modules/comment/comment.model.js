"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Comment = void 0;
const mongoose_1 = require("mongoose");
const CommentSchema = new mongoose_1.Schema({
    postId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Post", required: true },
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    comment: { type: String, required: true },
    parentCommentId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Comment",
        default: null,
    },
    likes: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "User",
            default: [],
        },
    ],
}, { timestamps: true });
exports.Comment = (0, mongoose_1.model)("Comment", CommentSchema);
