import createHttpError from "http-errors";
import Post, { PostInterface } from "../../models/Post";
import Comment, { CommentInterface } from "../../models/Comment";
import User from "../../models/User";
import { isValidObjectId } from "mongoose";
import { checkSchema, param, validationResult } from "express-validator";
import express from "express";
import { HydratedDocument } from "mongoose";
const debug = require("debug")("facebook:controllers/posts");

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

const addComment = [
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    checkSchema({
      pid: {
        in: ["params"],
        isMongoId: true,
      },
      author: {
        in: ["body"],
        isMongoId: true,
      },
      content: {
        in: ["body"],
        isString: true,
      },
    });
    next();
  },
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.sendStatus(400).json({ errors: errors.array() });
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
      const post = await Post.findById(req.params.pid);

      const comment: CommentInterface = new Comment({
        author: req.body.author,
        content: req.body.content,
        postID: req.params.pid,
      });

      post?.comments.push(comment);

      post?.save();
      res.status(201);
      return res.send(post);
    } catch (err) {
      next(err);
    }
  },
];

export { getNewsfeedPosts, getPost, editPost, addComment };
