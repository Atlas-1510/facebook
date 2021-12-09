import express from "express";
import routesConfig from "../routes/routesConfig";
import createHttpError from "http-errors";
import passport from "passport";
import passportConfig from "../authentication/passportConfig";

const app = express();

app.use(express.json());
passportConfig(passport);
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use("/", routesConfig);

app.use(function (req, res, next) {
  next(createHttpError(404));
});

export default app;
