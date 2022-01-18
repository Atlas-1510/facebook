import mongoose, { Schema } from "mongoose";

export interface CommentInterface {
  author: Schema.Types.ObjectId | string;
  content: string;
  postID: Schema.Types.ObjectId | string;
}

export const CommentSchema = new Schema<CommentInterface>(
  {
    author: { type: Schema.Types.ObjectId, required: true },
    content: { type: String, required: true },
    postID: { type: Schema.Types.ObjectId, required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Comment", CommentSchema);
