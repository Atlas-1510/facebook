import mongoose, { Schema } from "mongoose";

export interface UserInterface {
  email: string;
  firstName: string;
  lastName: string;
}

const UserSchema = new Schema<UserInterface>({
  email: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
});

export default mongoose.model("User", UserSchema);
