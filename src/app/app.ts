import express from "express";

export default function (database: any) {
  const app = express();

  app.use(express.json());

  app.use("/users/:userId", async (req, res, next) => {
    const { userId } = req.params;
    const user = await database.readUser(userId);
    res.send(user);
  });

  app.use("/users", async (req, res, next) => {
    return res.sendStatus(400);
  });

  return app;
}
