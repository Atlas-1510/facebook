import { Router } from "express";
import User from "../models/User";

const router = Router();

router.get("/", async (req, res) => {
  const users = await User.find();
  res.send(users);
});

router.get("/:uid", async (req, res) => {
  const { uid } = req.params;
  const user = await User.findById(uid);
  res.send(user);
});

export default router;
