import express from "express";
import routesConfig from "../routes/routesConfig";
import createHttpError from "http-errors";

const app = express();

app.use(express.json());

app.use("/api", routesConfig);

app.use(function (req, res, next) {
  next(createHttpError(404));
});

export default app;
