import mongoose, { Schema } from "mongoose";
import { CommentDocument, CommentSchema } from "./Comment";
import { Types, Document } from "mongoose";

export interface PostInput {
  author: Types.ObjectId;
  content?: string;
  comments: CommentDocument[];
  likes: Types.ObjectId[];
  image?: string;
}

export interface PostDocument extends PostInput, Document {
  author: Types.ObjectId;
  content: string;
  comments: Types.DocumentArray<CommentDocument>;
  likes: Types.ObjectId[];
  image?: string;
}

const PostSchema = new Schema<PostDocument>(
  {
    author: { type: Schema.Types.ObjectId, required: true },
    content: { type: String },
    comments: [CommentSchema],
    likes: [Schema.Types.ObjectId],
    image: { type: String },
  },
  {
    timestamps: {
      currentTime: () => Math.floor(Date.now() / 1000),
    },
  }
);

const PostModel = mongoose.model<PostDocument>("Post", PostSchema);

export default PostModel;
