import mongoose, { Schema } from "mongoose";
import User from "./UserInterface";

const UserSchema = new Schema<User>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
});

export default mongoose.model("User", UserSchema);
