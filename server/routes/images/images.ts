import { Router } from "express";
import { getImage } from "../../controllers/images/image";
import { ensureAuthenticated } from "../../controllers/authentication/authentication";

const router = Router();

router.get("/:key", ensureAuthenticated, getImage);

export default router;
