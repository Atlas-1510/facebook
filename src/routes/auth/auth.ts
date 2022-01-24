import { Router } from "express";
import {
  tryLogin,
  googleAuth,
  googleAuthRedirect,
  facebookAuth,
  facebookAuthRedirect,
  logout,
} from "../../controllers/authentication/authentication";
const router = Router();

router.post("/login", tryLogin);

router.get("/google", googleAuth);

// callback route for google to redirect to
router.get("/google/redirect", googleAuthRedirect);

router.get("/facebook", facebookAuth);

router.get("/facebook/redirect", facebookAuthRedirect);

router.get("/logout", logout);

export default router;
