import mongoose, { Schema } from "mongoose";

export interface UserInterface {
  email: string;
  firstName: string;
  lastName: string;
  friends?: string[];
}

const UserSchema = new Schema<UserInterface>({
  email: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  friends: { type: Array, default: [] },
});

export default mongoose.model("User", UserSchema);
