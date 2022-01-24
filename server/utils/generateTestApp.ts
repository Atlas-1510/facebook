import express from "express";
import routesConfig from "../routes/routesConfig";
import createHttpError from "http-errors";
import passport from "passport";
import passportConfig from "../passportConfig";
import session from "express-session";

export default function generateTestApp(
  type: "get" | "post" | "put" | "delete",
  route: string,
  fn: any
) {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  switch (type) {
    case "get":
      app.get(route, fn);
      break;
    case "post":
      app.post(route, fn);
      break;
    case "put":
      app.put(route, fn);
      break;
    case "delete":
      app.delete(route, fn);
      break;
    default:
      throw new Error("invalid route type for generateTestApp()");
  }

  app.use(function (req, res, next) {
    next(createHttpError(404));
  });
  return app;
}
