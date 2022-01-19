import { Router } from "express";
import {
  createPost,
  editPost,
  getNewsfeedPosts,
  getPost,
  addComment,
  editComment,
} from "../../controllers/posts/posts";
import { ensureAuthenticated } from "../../controllers/authentication/authentication";

const router = Router();

router.get("/newsfeed", ensureAuthenticated, getNewsfeedPosts);

router.get("/:pid", ensureAuthenticated, getPost);

router.post("/", ensureAuthenticated, createPost);

router.put("/:pid", ensureAuthenticated, editPost);

router.post("/:pid/comments", ensureAuthenticated, addComment);

router.put("/:pid/comments/:cid", ensureAuthenticated, editComment);

export default router;
