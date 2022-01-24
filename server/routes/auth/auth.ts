import { Router } from "express";
import {
  tryLogin,
  getAuthStatus,
  googleAuth,
  googleAuthRedirect,
  logout,
} from "../../controllers/authentication/authentication";
const router = Router();

router.post("/login", tryLogin);

router.get("/getAuthStatus", getAuthStatus);

router.get("/google", googleAuth);

// callback route for google to redirect to
router.get("/google/redirect", googleAuthRedirect);

router.get("/logout", logout);

export default router;
