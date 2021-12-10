import { Router } from "express";
import {
  getAllUsers,
  createNewUser,
  getUser,
  updateUser,
} from "../../controllers/users/users";

const router = Router();

router.get("/", getAllUsers);

router.post("/", createNewUser);

router.get("/:uid", getUser);

router.put("/:uid", updateUser);

export default router;
