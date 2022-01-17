import createHttpError from "http-errors";
import Post, { PostInterface } from "../../models/Post";
import User from "../../models/User";
import { isValidObjectId } from "mongoose";
import { param, validationResult } from "express-validator";
import express from "express";

const getNewsfeedPosts = async (req: any, res: any, next: any) => {
  try {
    if (req.user) {
      const user = req.user;
      const results = await Post.find({
        author: { $in: [...user!.friends!, user._id] },
      }).exec();
      return res.send(results);
    } else {
      throw new Error("req.user is not defined in getNewsfeedPosts");
    }
  } catch (err: any) {
    return next(err);
  }
};

const getPost = [
  param("pid", "A valid PID must be provided")
    .exists()
    .custom((pid) => isValidObjectId(pid)),
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    } else {
      return next();
    }
  },
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const { pid } = req.params;
      const post = await Post.findById(pid);
      if (post === null) {
        return res.sendStatus(404);
      }
      return res.send(post);
    } catch (err) {
      return next(err);
    }
  },
];

const editPost = [
  param("pid", "A valid PID must be provided")
    .exists()
    .custom((pid) => isValidObjectId(pid)),
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    } else {
      return next();
    }
  },
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const { pid } = req.params;
      const post = await Post.findById(pid);
      if (!post) {
        return res.sendStatus(404);
      }
      Object.keys(req.body).forEach((key) => {
        post[key as keyof PostInterface] = req.body[key];
      });

      const updatedDocument = await post.save();

      return res.send(updatedDocument);
    } catch (err) {
      return next(err);
    }
  },
];

export { getNewsfeedPosts, getPost, editPost };
