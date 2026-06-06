import ApiError from "../../../errors/api_error";
import { ITokenPayload } from "../../../interfaces/token";
import { User } from "../user/user.model";
import { IComment, ICommentPayload } from "./comment.interface";
import httpStatus from "http-status";
import { Comment } from "./comment.model";
import { Types } from "mongoose";
import { Post } from "../post/post.model";

const createComment = async (
  payload: ICommentPayload,
  token: ITokenPayload
) => {
  const { _id, email } = token;
  const user = _id ? await User.findById(_id) : await User.findOne({ email });
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User not found!");
  }

  const post = await Post.findOne({
    _id: payload.postId,
    isDeleted: { $ne: true },
  });
  if (!post) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Post not found!");
  }

  // Atomic $inc to avoid race condition on concurrent comment creation
  await Post.findByIdAndUpdate(post._id, { $inc: { commentsCount: 1 } });

  const commentData: Omit<IComment, "parentCommentId"> = {
    postId: new Types.ObjectId(payload.postId),
    userId: user._id,
    comment: payload.comment,
  };

  if (payload.parentCommentId) {
    (commentData as IComment).parentCommentId = new Types.ObjectId(
      payload.parentCommentId
    );
  }

  const res = await Comment.create(commentData);
  return res;
};

const getCommentsByPostId = async (postId: string) => {
  // Use postId field (not post), ObjectId cast, populate correct fields,
  // filter only top-level comments (no parentCommentId), sort newest first
  const comments = await Comment.find({
    postId: new Types.ObjectId(postId),
    parentCommentId: { $exists: false },
  })
    .populate("userId", "name email profile.avatar")
    .sort({ createdAt: -1 });

  return comments;
};

const toggleCommentLike = async (commentId: string, token: ITokenPayload) => {
  const { _id, email } = token;
  const user = _id ? await User.findById(_id) : await User.findOne({ email });
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User not found!");
  }

  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Comment not found!");
  }

  const post = await Post.findOne({
    _id: comment.postId,
    isDeleted: { $ne: true },
  });
  if (!post) {
    throw new ApiError(httpStatus.NOT_FOUND, "Post not found!");
  }

  // Atomic $addToSet / $pull to avoid race condition on concurrent like toggles.
  // Read-modify-write would allow two concurrent requests to both see the like
  // as absent and both add it, resulting in duplicate entries.
  const isCurrentlyLiked = await Comment.exists({
    _id: comment._id,
    likes: user._id,
  });

  const updatedComment = await Comment.findByIdAndUpdate(
    comment._id,
    isCurrentlyLiked
      ? { $pull: { likes: user._id } }
      : { $addToSet: { likes: user._id } },
    { new: true }
  );

  return updatedComment;
};

const deleteComment = async (commentId: string, token: ITokenPayload) => {
  const { _id, email, role } = token;
  const user = _id ? await User.findById(_id) : await User.findOne({ email });
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User not found!");
  }
  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(httpStatus.NOT_FOUND, "Comment not found!");
  }
  // Only the comment author or an admin/super-admin can delete
  const isAuthor = comment.userId.toString() === user._id.toString();
  const isAdmin = role === "ADMIN" || role === "SUPER_ADMIN";
  if (!isAuthor && !isAdmin) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You are not authorized to delete this comment!"
    );
  }
  await Comment.findByIdAndDelete(commentId);
  // Decrement commentsCount on the post atomically
  await Post.findByIdAndUpdate(comment.postId, {
    $inc: { commentsCount: -1 },
  });
  return { message: "Comment deleted successfully!" };
};

export const CommentService = {
  createComment,
  getCommentsByPostId,
  toggleCommentLike,
};
  deleteComment,
};
