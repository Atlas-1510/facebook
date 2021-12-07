import express from "express";
import usersRoute from "../routes/users";

export default function () {
  const app = express();

  app.use(express.json());

  app.use("/users", usersRoute);

  return app;
}
