import createHttpError from "http-errors";
import Post, { PostInterface } from "../../models/Post";
import Comment, { CommentInterface } from "../../models/Comment";
import { isValidObjectId, Mongoose } from "mongoose";
import { body, param } from "express-validator";
import express from "express";
import { HydratedDocument, Types } from "mongoose";
import processValidation from "../../utils/processValidation";
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
  processValidation,
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

const createPost = [
  body("author").isMongoId(),
  body("content").isString(),
  processValidation,
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const post: HydratedDocument<PostInterface> = new Post({
        author: req.body.author,
        content: req.body.content,
        comments: [],
      });

      post.save();
      res.status(201);
      return res.send(post);
    } catch (err) {
      next(err);
    }
  },
];

const editPost = [
  param("pid", "A valid PID must be provided")
    .exists()
    .custom((pid) => isValidObjectId(pid)),
  processValidation,
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const { pid } = req.params;
      const post: HydratedDocument<PostInterface> | null = await Post.findById(
        pid
      );
      if (!post) {
        return res.sendStatus(404);
      } else {
        Object.keys(req.body).forEach((key) => {
          post[key as keyof PostInterface] = req.body[key];
        });

        const updatedDocument = await post?.save();
        return res.send(updatedDocument);
      }
    } catch (err) {
      return next(err);
    }
  },
];

const addComment = [
  param("pid").isMongoId(),
  body("author").isMongoId(),
  body("content").isString(),
  processValidation,
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
// need to implement editComment logic below
const editComment = [
  param("pid", "Please provide a valid pid").isMongoId(),
  param("cid", "Please provide a valid cid").isMongoId(),
  body("content", "Please provide comment content").exists().isString(),
  processValidation,
  async (req: any, res: express.Response, next: express.NextFunction) => {
    try {
      const post = await Post.findById(req.params.pid);
      const comment = post?.comments.id(req.params.cid);
      if (!req.user._id.equals(comment?.author)) {
        return res.status(403).json({
          error: "Only the author can edit this content.",
        });
      }

      comment?.set(req.body);
      post?.save();
      return res.status(200).send(post);
    } catch (err) {
      return next(err);
    }
  },
];

export {
  getNewsfeedPosts,
  getPost,
  createPost,
  editPost,
  addComment,
  editComment,
};
