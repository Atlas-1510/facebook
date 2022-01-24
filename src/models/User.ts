import mongoose, {
  Schema,
  Document,
  ObjectId,
  Types,
  SchemaTypes,
} from "mongoose";

export interface UserInput {
  email: string;
  firstName: string;
  lastName: string;
  friends?: ObjectId[];
  inboundFriendRequests?: ObjectId[];
  outboundFriendRequests?: ObjectId[];
  googleId?: string;
}

export interface UserDocument extends UserInput, Document {
  email: string;
  firstName: string;
  lastName: string;
  friends: ObjectId[];
  inboundFriendRequests: ObjectId[];
  outboundFriendRequests: ObjectId[];
  googleId: string;
}

const UserSchema = new Schema<UserDocument>({
  email: { type: Schema.Types.String, required: true },
  firstName: { type: Schema.Types.String, required: true },
  lastName: { type: Schema.Types.String, required: true },
  friends: { type: [Schema.Types.ObjectId], default: [] },
  inboundFriendRequests: { type: [Schema.Types.ObjectId], default: [] },
  outboundFriendRequests: { type: [Schema.Types.ObjectId], default: [] },
  googleId: { type: Schema.Types.String },
});

export default mongoose.model("User", UserSchema);
