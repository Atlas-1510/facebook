import createHttpError from "http-errors";
import Post from "../../models/Post";
import User from "../../models/User";
import { isValidObjectId } from "mongoose";

const getNewsfeedPosts = async (req: any, res: any, next: any) => {
  try {
    const { uid } = req.params;
    if (!isValidObjectId(uid)) {
      const err = createHttpError(400, "Provided UID is invalid");
      throw err;
    }
    const friends = await User.find(uid).select("friends").exec();
    const results = await Post.find().where("author").in(friends).exec();
    return res.send(results);
  } catch (err: any) {
    return next(err);
  }
};

const getPost = async (req: any, res: any, next: any) => {
  try {
    const { pid } = req.params;
    if (!pid || !isValidObjectId(pid)) {
      const err = createHttpError(400, "Please provide a valid post ID");
      throw err;
    }
    const post = await Post.findById(pid);
    return res.send(post);
  } catch (err) {
    return next(err);
  }
};

const editPost = async (req: any, res: any, next: any) => {
  try {
    const { pid } = req.params;
    if (!pid || !isValidObjectId(pid)) {
      const err = createHttpError(400, "Please provide a valid post ID");
      throw err;
    }
    const updates: any = {};
    const postFields = Object.keys(Post.schema.paths);
    postFields.map((field) => {
      if (field in req.body) {
        updates[field] = req.body[field];
      }
    });
    const doc = await Post.findByIdAndUpdate(pid, updates);
    return res.send(doc);
  } catch (err) {
    return next(err);
  }
};

export { getNewsfeedPosts, getPost, editPost };
