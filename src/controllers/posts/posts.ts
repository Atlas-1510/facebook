import createHttpError from "http-errors";
import Post, { PostInterface } from "../../models/Post";
import User from "../../models/User";
import { isValidObjectId } from "mongoose";
import { param, validationResult } from "express-validator";
import express from "express";

const getNewsfeedPosts = [
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
  async (req: any, res: any, next: any) => {
    try {
      const { uid } = req.params;
      const user = await User.findById(uid).exec();
      const results = await Post.find({
        author: { $in: [...user!.friends!, uid] },
      }).exec();
      return res.send(results);
    } catch (err: any) {
      return next(err);
    }
  },
];

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
