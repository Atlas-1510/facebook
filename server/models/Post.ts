import mongoose, { Schema } from "mongoose";
import { CommentDocument, CommentSchema } from "./Comment";
import { Types, Document } from "mongoose";

export interface PostInput {
  author: Types.ObjectId;
  content: string;
  comments: CommentDocument[];
  likes: Types.ObjectId[];
}

export interface PostDocument extends PostInput, Document {
  author: Types.ObjectId;
  content: string;
  comments: Types.DocumentArray<CommentDocument>;
  likes: Types.ObjectId[];
}

const PostSchema = new Schema<PostDocument>(
  {
    author: { type: Schema.Types.ObjectId, required: true },
    content: { type: String, required: true },
    comments: [CommentSchema],
    likes: [Schema.Types.ObjectId],
  },
  {
    timestamps: true,
  }
);

const PostModel = mongoose.model<PostDocument>("Post", PostSchema);

export default PostModel;
