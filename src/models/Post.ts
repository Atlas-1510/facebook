import mongoose, { Date, Schema } from "mongoose";
import { CommentInterface, CommentSchema } from "./Comment";

export interface PostInterface {
  author: Schema.Types.ObjectId | string;
  content: string;
  comments: CommentInterface[];
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

export default mongoose.model("Post", PostSchema);
