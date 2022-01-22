import express from "express";
import { body } from "express-validator";
import processValidation from "../../utils/processValidation";
import User, { UserDocument } from "../../models/User";
import mongoose from "mongoose";
import removeItem from "../../utils/removeItem";

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

// to respond to a received friend request (accept/reject)
const handleRequest = [
  body("fid").isMongoId(),
  body("action").isIn(["accept", "reject"]),
  processValidation,
  async (req: any, res: express.Response, next: express.NextFunction) => {
    try {
      const user: UserDocument = req.user;
      const author: UserDocument | null = await User.findById(req.body.fid);
      if (!author) {
        return res.status(404).json({
          message: "The author of this friend request could not be found.",
        });
      }

      if (!user.inboundFriendRequests?.includes(req.body.fid)) {
        return res.status(400).json({
          message: "A friend request could not be found from this user.",
        });
      }
      const session = await mongoose.startSession();
      await session.withTransaction(async () => {
        removeItem(user.inboundFriendRequests, req.body.fid);

        removeItem(author.outboundFriendRequests, user._id);
        if (req.body.action === "accept") {
          user.friends?.push(req.body.fid);

          author.friends?.push(user._id);
        }

        await user.save();
        await author.save();
      });
      session.endSession();
      res.status(201);
      return res.send(user);
    } catch (err) {
      return next(err);
    }
  },
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
