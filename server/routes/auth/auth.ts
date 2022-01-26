import { Router } from "express";
import {
  tryLogin,
  getAuthStatus,
  googleAuth,
  googleAuthRedirect,
  logout,
} from "../../controllers/authentication/authentication";
const router = Router();

// TODO: Remove login delay timer middleware below
router.post(
  "/login",
  function (req, res, next) {
    setTimeout(next, 1000);
  },
  tryLogin
);

router.get("/getAuthStatus", getAuthStatus);

router.get("/google", googleAuth);

// callback route for google to redirect to
router.get("/google/redirect", googleAuthRedirect);

router.get("/logout", logout);

export default router;
