import express from "express";
import routesConfig from "../routes/routesConfig";
import createHttpError from "http-errors";
import passport from "passport";
import passportConfig from "../passportConfig";
import session from "cookie-session";
import cors from "cors";
require("dotenv").config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

app.use(express.json());
passportConfig(passport);
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: `${process.env.COOKIE_SECRET}`,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use("/", routesConfig);

app.use(function (req, res, next) {
  next(createHttpError(404));
});

export default app;
