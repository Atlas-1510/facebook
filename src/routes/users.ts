import { Router } from "express";
import User from "../models/User";

const router = Router();

router.get("/", async (req, res) => {
  const users = await User.find();
  res.send(users);
});

export default router;
