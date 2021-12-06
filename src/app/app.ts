import express from "express";
import { DatabaseInterface } from "../database/database";

export default function (database: DatabaseInterface) {
  const app = express();

  app.use(express.json());

  app.use("/users/:userId", async (req, res, next) => {
    const { userId } = req.params;
    const user = await database.getUser(userId);
    res.send(user);
  });

  return app;
}
