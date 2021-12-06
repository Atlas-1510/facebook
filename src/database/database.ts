import mongoose from "mongoose";
import User from "../models/User";

const mongoDb = `mongodb+srv://${process.env.MONGODB_NAME}:${process.env.MONGODB_PASSWORD}@cluster0.5psxe.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

mongoose.connect(mongoDb);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));

const database: object = {
  readUser: async function (userId: string) {
    const result = await User.findById(userId);
    return result;
  },
};

export default database;
