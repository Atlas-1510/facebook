import mongoose, { Schema, Types } from "mongoose";

export interface CommentInterface extends Types.Subdocument {
  author: Schema.Types.ObjectId | string;
  content: string;
  postID: Schema.Types.ObjectId;
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
