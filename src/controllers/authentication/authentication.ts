import passport from "passport";
import createHttpError from "http-errors";
const debug = require("debug")("facebook:controllers:authentication");

const tryLogin = (req: any, res: any, next: any) => {
  debug("tryLogin request recieved");
  passport.authenticate("local", function (err, user, info) {
    return res.send(user);
  })(req, res, next);
};

const ensureAuthenticated = (req: any, res: any, next: any) => {
  debug("ensureAuthenticated request recieved");
  if (req.isAuthenticated()) {
    return next();
  } else {
    const error = createHttpError(401, "Please login to view this");
    return res.send(error);
  }
};

export { tryLogin, ensureAuthenticated };
