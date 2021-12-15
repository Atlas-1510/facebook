import mongoose, { Date, Schema } from "mongoose";
import { CommentSchema } from "./Comment";

const PostSchema = new Schema({
  author: { type: Schema.Types.ObjectId, required: true },
  createdAt: { type: Schema.Types.Date, required: true },
  content: { type: String, required: true },
  comments: [CommentSchema],
});

export default mongoose.model("Post", PostSchema);
