import { model, Schema } from "mongoose";
import { IReaction, ReactionModel } from "./reaction.interface";

const ReactionSchema: Schema<IReaction> = new Schema<IReaction, ReactionModel>(
  {
    postId: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: ["like", "love", "laugh", "angry", "sad"],
      required: true,
    },
  },
  { timestamps: true }
);

export const Reaction = model<IReaction, ReactionModel>(
  "Reaction",
  ReactionSchema
);
