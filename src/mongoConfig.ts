import mongoose from "mongoose";

export default function () {
  const mongoDb = `mongodb+srv://${process.env.MONGODB_NAME}:${process.env.MONGODB_PASSWORD}@cluster0.5psxe.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

  mongoose.connect(mongoDb);
  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "mongo connection error"));
}
