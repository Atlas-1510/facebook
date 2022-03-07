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
  facebookId?: string;
  displayPhoto?: string;
  password?: string;
}

export interface UserDocument extends UserInput, Document {
  email: string;
  firstName: string;
  lastName: string;
  friends: ObjectId[];
  inboundFriendRequests: ObjectId[];
  outboundFriendRequests: ObjectId[];
  googleId?: string;
  facebookId?: string;
  displayPhoto: string;
  password?: string;
}

const UserSchema = new Schema<UserDocument>(
  {
    email: { type: Schema.Types.String, required: true },
    firstName: { type: Schema.Types.String, required: true },
    lastName: { type: Schema.Types.String, required: true },
    friends: { type: [Schema.Types.ObjectId], default: [] },
    inboundFriendRequests: { type: [Schema.Types.ObjectId], default: [] },
    outboundFriendRequests: { type: [Schema.Types.ObjectId], default: [] },
    displayPhoto: { type: Schema.Types.String },
    password: { type: Schema.Types.String },
    facebookId: { type: Schema.Types.String },
    googleId: { type: Schema.Types.String },
  },
  {
    toJSON: { virtuals: true },
    toObject: { getters: true },
  }
);

UserSchema.virtual("fullName").get(function (this: {
  firstName: string;
  lastName: string;
}) {
  return `${this.firstName} ${this.lastName}`;
});

export default mongoose.model("User", UserSchema);
