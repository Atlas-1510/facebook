import { Router } from "express";
import { ensureAuthenticated } from "../../controllers/authentication/authentication";
import {
  getAllUsers,
  getUser,
  updateUser,
} from "../../controllers/users/users";

const router = Router();

router.get("/", ensureAuthenticated, getAllUsers);

router.get("/:uid", ensureAuthenticated, getUser);

router.put("/:uid", ensureAuthenticated, updateUser);

export default router;
