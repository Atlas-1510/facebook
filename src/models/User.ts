import mongoose, { Schema } from "mongoose";

interface User {
  firstName: string;
  lastName: string;
}

const UserSchema = new Schema<User>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
});

export default mongoose.model("User", UserSchema);
