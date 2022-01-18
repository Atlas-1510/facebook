import passport from "passport";
import createHttpError from "http-errors";
const debug = require("debug")("facebook:controllers:authentication");

const tryLogin = (req: any, res: any, next: any) => {
  passport.authenticate("local", function (err, user, info) {
    req.logIn(user, function (err: any) {
      if (err) {
        return next(err);
      }
      return res.send(user);
    });
  })(req, res, next);
};

const ensureAuthenticated = (req: any, res: any, next: any) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    const error = createHttpError(401, "Please login to view this");
    return res.send(error);
  }
};

export { tryLogin, ensureAuthenticated };
