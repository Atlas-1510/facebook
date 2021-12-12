import { Router } from "express";
import { tryLogin } from "../../controllers/authentication/authentication";
const router = Router();

router.post("/", tryLogin);

export default router;
