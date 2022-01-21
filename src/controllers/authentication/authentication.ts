import passport from "passport";
import createHttpError from "http-errors";
import express from "express";

const debug = require("debug")("facebook:controllers:authentication");

const tryLogin = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  passport.authenticate("local", function (err, user, info) {
    req.logIn(user, function (err: any) {
      if (err) {
        return next(err);
      }
      return res.send(user);
    });
  })(req, res, next);
};

const ensureAuthenticated = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    const error = createHttpError(401, "Please login to view this");
    return res.send(error);
  }
};

export { tryLogin, ensureAuthenticated };
