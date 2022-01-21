import express from "express";
import { body } from "express-validator";
import processValidation from "../../utils/processValidation";
import User, { UserDocument } from "../../models/User";
import mongoose from "mongoose";

// to send a friend request to another user
const sendRequest = [
  body("fid", "Please provide a target friend id").isMongoId(),
  processValidation,
  async (req: any, res: express.Response, next: express.NextFunction) => {
    try {
      const user: UserDocument = req.user;
      const target: UserDocument | null = await User.findById(req.body.fid);
      if (!target) {
        return res.status(404).json({
          message:
            "The target user for this friend request could not be found.",
        });
      }
      // if the target and the user are already friends, abort
      if (target.friends?.includes(user._id)) {
        return res.status(400).json({
          message: "You are already friends with this user.",
        });
      }
      // if the author has already sent a request to the target, abort
      if (target.inboundFriendRequests?.includes(user._id)) {
        return res.status(400).json({
          message: "You have already sent a friend request to this user.",
        });
      }
      const session = await mongoose.startSession();
      await session.withTransaction(async () => {
        target.inboundFriendRequests?.push(user._id);
        user.outboundFriendRequests?.push(target._id);
        await target.save();
        await user.save();
      });
      session.endSession();
      return res.sendStatus(201);
    } catch (err) {
      return next(err);
    }
  },
];

// to responsd to a recieved friend request (accept/reject/ignore?)
const handleRequest = [
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {},
];

// to get all recieved friend requests
const getRequests = [
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {},
];

// For a user to cancel an outbound friend request
const deleteRequest = [
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {},
];

export { sendRequest, deleteRequest, handleRequest, getRequests };
