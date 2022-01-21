import User, { UserDocument, UserInput } from "../../models/User";
import { isValidObjectId } from "mongoose";
import createHttpError from "http-errors";
import { body, param, validationResult } from "express-validator";
import express from "express";

const getAllUsers = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const users = await User.find();
  return res.send(users);
};

const createNewUser = [
  body("email").isEmail(),
  body("firstName").exists(),
  body("lastName").exists(),
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    } else {
      next();
    }
  },
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const newUser = await User.create({
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
      });
      res.status(201);
      return res.send(newUser);
    } catch (err: any) {
      next(err);
    }
  },
];

const getUser = [
  param("uid", "Must provide a valid uid")
    .exists()
    .custom((uid) => isValidObjectId(uid)),
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    } else {
      next();
    }
  },
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const { uid } = req.params;
    const user = await User.findById(uid);
    if (!user) {
      const err = createHttpError(404, "User not found in database");
      return res.status(err.status).send(err);
    }
    return res.send(user);
  },
];

const updateUser = [
  param("uid", "Must provide a valid uid")
    .exists()
    .custom((uid) => isValidObjectId(uid)),
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    } else {
      next();
    }
  },
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const { uid } = req.params;

    const update: any = {};

    Object.keys(req.body).forEach((key) => {
      update[key] = req.body[key];
    });

    const user = await User.findByIdAndUpdate(uid, update, {
      returnOriginal: false,
    });

    if (!user) {
      const err = createHttpError(404, "User not found in database");
      return res.status(err.status).send(err);
    }

    return res.send(user);
  },
];

export { getAllUsers, createNewUser, getUser, updateUser };
