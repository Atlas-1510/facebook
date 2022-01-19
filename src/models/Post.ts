import mongoose, { Date, Document, Schema } from "mongoose";
import { CommentInterface, CommentSchema } from "./Comment";
import { Types } from "mongoose";

export interface PostInterface {
  author: Schema.Types.ObjectId | string;
  content: string;
  comments: Types.DocumentArray<CommentInterface>;
}

const PostSchema = new Schema<PostInterface>(
  {
    author: { type: Schema.Types.ObjectId, required: true },
    content: { type: String, required: true },
    comments: [CommentSchema],
  },
  {
    timestamps: true,
  }
);

const PostModel = mongoose.model<PostInterface>("Post", PostSchema);

export default PostModel;
