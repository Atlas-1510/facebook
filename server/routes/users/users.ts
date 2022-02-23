import { Router } from "express";
import { ensureAuthenticated } from "../../controllers/authentication/authentication";
import {
  getAllUsers,
  getUser,
  updateUser,
} from "../../controllers/users/users";
import multer from "multer";

const router = Router();

const upload = multer({ dest: "uploads/" });

router.get("/", ensureAuthenticated, getAllUsers);

router.get("/:uid", ensureAuthenticated, getUser);

router.put(
  "/:uid",
  ensureAuthenticated,
  upload.single("newProfileImage"),
  updateUser
);

export default router;
