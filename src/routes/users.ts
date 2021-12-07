import { Router } from "express";
import User from "../models/User";
import { isValidObjectId } from "mongoose";

const router = Router();

router.get("/", async (req, res) => {
  const users = await User.find();
  res.send(users);
});

router.get("/:uid", async (req, res) => {
  const { uid } = req.params;
  if (!isValidObjectId(uid)) {
    return res.sendStatus(400);
  } else {
    const user = await User.findById(uid);
    if (!user) {
      return res.status(404);
    }
    return res.send(user);
  }
});

export default router;
