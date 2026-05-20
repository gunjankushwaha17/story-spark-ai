import { Model, Types } from "mongoose";

export interface IComment {
  postId: Types.ObjectId;
  userId: Types.ObjectId;
  comment: string;
  parentCommentId?: Types.ObjectId;
  likes?: Types.ObjectId[];
}

export type CommentModel = Model<IComment, object>;

export interface ICommentPayload {
  postId: string;
  comment: string;
  parentCommentId?: string;
}
