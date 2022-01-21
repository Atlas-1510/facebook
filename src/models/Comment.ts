import mongoose, { Schema, Types } from "mongoose";

export interface CommentInput {
  author: Schema.Types.ObjectId;
  content: string;
  postID: Schema.Types.ObjectId;
}

export interface CommentDocument extends CommentInput, Types.Subdocument {
  author: Schema.Types.ObjectId;
  content: string;
  postID: Schema.Types.ObjectId;
}

export const CommentSchema = new Schema<CommentDocument>(
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
