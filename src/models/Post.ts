import mongoose, { Date, Schema } from "mongoose";
import { CommentSchema } from "./Comment";

export interface PostInterface {
  author: Schema.Types.ObjectId;
  createdAt: Schema.Types.Date;
  content: string;
  comments: [typeof CommentSchema];
}

const PostSchema = new Schema<PostInterface>({
  author: { type: Schema.Types.ObjectId, required: true },
  createdAt: { type: Schema.Types.Date, required: true },
  content: { type: String, required: true },
  comments: [CommentSchema],
});

export default mongoose.model("Post", PostSchema);
