import { Router } from "express";
import {
  editPost,
  getNewsfeedPosts,
  getPost,
} from "../../controllers/posts/posts";
import { ensureAuthenticated } from "../../controllers/authentication/authentication";

const router = Router();

router.get("/newsfeed", ensureAuthenticated, getNewsfeedPosts);

router.get("/:pid", getPost);

router.put("/:pid", editPost);

export default router;
