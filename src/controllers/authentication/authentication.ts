import passport from "passport";
const debug = require("debug")("facebook:controllers:authentication:tryLogin");

const tryLogin = (req: any, res: any, next: any) => {
  debug("request recieved");
  passport.authenticate("local", function (err, user, info) {
    return res.send(user);
  })(req, res, next);
};

export { tryLogin };
