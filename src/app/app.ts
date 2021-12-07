import express from "express";
import usersRoute from "../routes/users";

const app = express();

app.use(express.json());

app.use("/users", usersRoute);

export default app;
