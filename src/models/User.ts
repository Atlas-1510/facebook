import mongoose, { Schema, Document } from "mongoose";

export interface UserInput {
  email: string;
  firstName: string;
  lastName: string;
  friends?: string[];
}

export interface UserDocument extends UserInput, Document {
  email: string;
  firstName: string;
  lastName: string;
  friends?: string[];
}

const UserSchema = new Schema<UserDocument>({
  email: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  friends: { type: Array, default: [] },
});

export default mongoose.model("User", UserSchema);
