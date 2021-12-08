import { Router } from "express";
import User from "../../models/User";
import { isValidObjectId } from "mongoose";
import UserInterface from "../../models/UserInterface";
import createHttpError from "http-errors";

const router = Router();

router.get("/", async (req, res, next) => {
  const users = await User.find();
  res.send(users);
});

router.post("/", async (req, res, next) => {
  const newUser = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  });
  const savedUser = await newUser.save();
  res.status(201);
  return res.send(savedUser);
});

router.get("/:uid", async (req, res, next) => {
  const { uid } = req.params;
  if (!isValidObjectId(uid)) {
    return next(createHttpError(400));
  } else {
    const user = await User.findById(uid);
    if (!user) {
      return next(createHttpError(404));
    }
    return res.send(user);
  }
});

router.put("/:uid", async (req, res, next) => {
  const { uid } = req.params;

  if (!isValidObjectId(uid)) {
    return next(createHttpError(400));
  }
  const user = await User.findById(uid);
  if (!user) {
    return next(createHttpError(404));
  }
  Object.keys(req.body).forEach((key) => {
    user[key as keyof UserInterface] = req.body[key];
  });

  const updatedDocument = await user.save();

  return res.send(updatedDocument);
});

export default router;
