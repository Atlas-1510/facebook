import { Router } from "express";
import {
  tryLogin,
  signup,
  getAuthStatus,
  googleAuth,
  googleAuthRedirect,
  logout,
  facebookAuth,
  facebookRedirect,
  demoLogin,
} from "../../controllers/authentication/authentication";
const router = Router();

// TODO: Remove login delay timer middleware below
router.post("/login", tryLogin);

router.get("/demoLogin", demoLogin);

router.post("/signup", signup);

router.get("/getAuthStatus", getAuthStatus);

router.get("/google", googleAuth);

// callback route for google to redirect to
router.get("/google/redirect", googleAuthRedirect);

router.get("/facebook", facebookAuth);

router.get("/facebook/redirect", facebookRedirect);

router.get("/logout", logout);

export default router;
