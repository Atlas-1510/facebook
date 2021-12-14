import mongoose, { Schema } from "mongoose";

export interface CommentInterface {}

export const CommentSchema = new Schema<CommentInterface>({});

export default mongoose.model("Comment", CommentSchema);
