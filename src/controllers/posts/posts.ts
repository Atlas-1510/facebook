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

export { getNewsfeedPosts };
