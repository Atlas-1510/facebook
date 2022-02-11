import User, { UserDocument, UserInput } from "../../models/User";
import { isValidObjectId } from "mongoose";
import createHttpError from "http-errors";
import { body, param, validationResult } from "express-validator";
import express from "express";
import processValidation from "../../utils/processValidation";
import bcrypt from "bcryptjs";

const getAllUsers = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const users = await User.find();
  return res.send(users);
};

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
  async (req: any, res: express.Response, next: express.NextFunction) => {
    const { uid } = req.params;
    const userDoc = await User.findById(uid);
    if (!userDoc) {
      const err = createHttpError(404, "User not found in database");
      return res.status(err.status).send(err);
    }
    const user: any = Object.assign({}, userDoc.toObject());
    delete user.password;
    if (uid !== req.user._id.toString()) {
      delete user?.googleID;
      delete user.inboundFriendRequests;
      delete user.outboundFriendRequests;
    }
    return res.send(user);
  },
];

const updateUser = [
  param("uid", "Must provide a valid uid")
    .exists()
    .custom((uid) => isValidObjectId(uid)),
  body("currentPassword").isString(),
  processValidation,
  async (req: any, res: express.Response, next: express.NextFunction) => {
    try {
      const { uid } = req.params;
      if (uid !== req.user._id.toString()) {
        return res.status(403).send({
          type: "failure",
          message: "You must login as this user to edit this account.",
        });
      }
      const providedPassword = req.body.currentPassword;

      const user = await User.findById(uid);
      if (!user) {
        return res.status(404).send({
          type: "failure",
          message: "This user account could not be found.",
        });
      }
      const authSuccess = await bcrypt.compare(providedPassword, user.password);
      if (!authSuccess) {
        return res.status(200).send({
          type: "failure",
          message: "The password you provided was incorrect.",
        });
      }
      const update: any = {};

      Object.keys(req.body).forEach((key) => {
        update[key] = req.body[key];
      });

      await User.findByIdAndUpdate(uid, update, {
        returnOriginal: false,
      });

      return res.send({
        type: "success",
        message: "Your account has been successfully updated.",
        payload: user,
      });
    } catch (err) {
      return next(err);
    }
  },
];

export { getAllUsers, getUser, updateUser };
