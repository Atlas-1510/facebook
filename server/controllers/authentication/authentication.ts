import passport from "passport";
import createHttpError from "http-errors";
import express from "express";
import { body } from "express-validator";
import processValidation from "../../utils/processValidation";
import User, { UserDocument } from "../../models/User";
import bcrypt from "bcryptjs";

const debug = require("debug")("facebook:controllers:authentication");

// Note: Facebook login not possible due to issues with https/http, CORS, and seemingly requiring a full on privacy policy
// and way for users to delete data just to get a test app going. Google authentication is much simpler.

const tryLogin = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  passport.authenticate("local", function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (info) {
      return res.send(info);
    }
    req.logIn(user, function (err: any) {
      if (err) {
        return next(err);
      }
      return res.send(user);
    });
  })(req, res, next);
};

const demoLogin = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const demoUser = await User.findById("62269f0f81c08a059dd68851");
    if (!demoUser) {
      throw new Error("demo account is missing");
    }
    req.login(demoUser, (err) => {
      if (err) {
        return res.send(err);
      }
    });
    res.send(demoUser);
  } catch (err) {}
};

// TODO: Add stronger password requirements via express-validator
const signup = [
  body("email", "Please provide an email"),
  body("password", "Please provide a password"),
  processValidation,
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const existingUser = await User.findOne({
        email: req.body.email,
      }).exec();

      if (existingUser) {
        const info = {
          statusCode: 200,
          message: "That email is already in use.",
        };
        return res.send(info);
      }
      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      // TODO: Remove hashed password from the response back to the client.
      const user = new User({
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: hashedPassword,
      });
      await user.save();
      req.logIn(user, function (err: any) {
        if (err) {
          return next(err);
        }
        const userObj: any = { ...user.toObject() };
        delete userObj.password;
        return res.status(201).send(userObj);
      });
    } catch (err) {
      return next(err);
    }
  },
];

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

const getAuthStatus = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  if (req.isAuthenticated()) {
    return res.send(req.user);
  } else {
    return res.send(false);
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
    return res.redirect("http://localhost:3000");
  },
];
// facebook auth is disabled, see note at top of this file.
const facebookAuth = [
  passport.authenticate("facebook", {
    scope: ["email"],
  }),
];
// facebook auth is disabled, see note at top of this file.
const facebookRedirect = [
  passport.authenticate("facebook", {
    failureRedirect: "/login",
    failureMessage: true,
  }),
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
  demoLogin,
  signup,
  ensureAuthenticated,
  getAuthStatus,
  googleAuth,
  googleAuthRedirect,
  facebookAuth,
  facebookRedirect,
  logout,
};
