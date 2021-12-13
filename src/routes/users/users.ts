import { Router } from "express";
import { ensureAuthenticated } from "../../controllers/authentication/authentication";
import {
  getAllUsers,
  createNewUser,
  getUser,
  updateUser,
} from "../../controllers/users/users";

const router = Router();

router.get("/", ensureAuthenticated, getAllUsers);

router.post("/", createNewUser);

router.get("/:uid", getUser);

router.put("/:uid", updateUser);

export default router;
