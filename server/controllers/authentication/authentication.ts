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

const googleAuth = [
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  }),
];

const googleAuthRedirect = [
  passport.authenticate("google"),
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    return res.send(req.user);
  },
];

const logout = [
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    req.logOut();
    return res.send("Logged Out");
  },
];

export {
  tryLogin,
  ensureAuthenticated,
  googleAuth,
  googleAuthRedirect,
  logout,
};