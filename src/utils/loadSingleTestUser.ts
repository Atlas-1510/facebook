import mongoose from "mongoose";
import User from "../models/User";
export default async function () {
  const testId = new mongoose.Types.ObjectId();
  await new User({
    _id: testId,
    firstName: "Test",
    lastName: "McTest",
  }).save();
  return testId;
}
