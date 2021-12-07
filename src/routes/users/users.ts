import { Router } from "express";
import User from "../../models/User";
import { isValidObjectId } from "mongoose";
import UserInterface from "../../models/UserInterface";

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

router.post("/:uid", async (req, res) => {
  const { uid } = req.params;
  // console.log(req.body);
  if (!isValidObjectId(uid)) {
    return res.sendStatus(400);
  }
  const user = await User.findById(uid);
  if (!user) {
    return res.sendStatus(404);
  }
  Object.keys(req.body).forEach((key) => {
    user[key as keyof UserInterface] = req.body[key];
  });

  const updatedDocument = await user.save();

  return res.send(updatedDocument);
});

export default router;
