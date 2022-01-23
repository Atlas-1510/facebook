import { Router } from "express";
import { tryLogin } from "../../controllers/authentication/authentication";
const router = Router();

router.post("/login", tryLogin);

export default router;
