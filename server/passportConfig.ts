import User, { UserDocument } from "./models/User";
import bcrypt from "bcryptjs";
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20");
const debug = require("debug")("facebook:passportConfig");
require("dotenv").config();

export default function (passport: any) {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
      },
      async (email: any, password: any, done: any) => {
        try {
          const user: UserDocument | null = await User.findOne({
            email: email,
          });
          if (!user) {
            return done(null, false, { message: "Username not found" });
          }
          if (!user.password) {
            return done(null, false, {
              message: "Error, no password defined for this user???",
            });
          }
          const loginSuccess = await bcrypt.compare(password, user.password);
          if (loginSuccess) {
            return done(null, user);
          } else {
            return done(null, false, { message: "Incorrect password" });
          }
        } catch (err) {
          return done(err);
        }
      }
    )
  );
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/redirect",
      },
      (accessToken: any, refreshToken: any, profile: any, done: any) => {
        try {
          // Note: Using async/await syntax here leads to an internal server error. For some reason, it must use .then() chaining.
          User.findOne({ googleId: profile.id }).then((currentUser) => {
            if (currentUser) {
              return done(null, currentUser);
            } else {
              new User({
                googleId: profile.id,
                email: profile._json.email,
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
              })
                .save()
                .then((newUser) => {
                  done(null, newUser);
                });
            }
          });
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  passport.serializeUser(function (user: any, done: any) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id: any, done: any) {
    User.findById(id, function (err: any, user: any) {
      done(err, user);
    });
  });
}
