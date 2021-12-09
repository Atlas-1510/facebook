import { Router } from "express";
import passport from "passport";

const router = Router();

router.post("/", (req, res, next) => {
  passport.authenticate("local", function (err, user, info) {
    return res.send(user);
  })(req, res, next);
});

export default router;
