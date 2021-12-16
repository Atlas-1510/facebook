import { Router } from "express";
import {
  editPost,
  getNewsfeedPosts,
  getPost,
} from "../../controllers/posts/posts";

const router = Router();

router.get("/newsfeed/:uid", getNewsfeedPosts);

router.get("/:pid", getPost);

router.put("/:pid", editPost);

export default router;
