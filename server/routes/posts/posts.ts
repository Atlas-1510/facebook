import { Router } from "express";
import {
  createPost,
  editPost,
  deletePost,
  getNewsfeedPosts,
  getPost,
  addComment,
  editComment,
  deleteComment,
  likePost,
  unlikePost,
  getProfilePosts,
} from "../../controllers/posts/posts";
import { ensureAuthenticated } from "../../controllers/authentication/authentication";

const router = Router();

router.get("/newsfeed", ensureAuthenticated, getNewsfeedPosts);

router.get("/profile/:fid", ensureAuthenticated, getProfilePosts);

router.get("/:pid", ensureAuthenticated, getPost);

router.post("/", ensureAuthenticated, createPost);

router.put("/:pid", ensureAuthenticated, editPost);

router.delete("/:pid", ensureAuthenticated, deletePost);

router.post("/:pid/comments", ensureAuthenticated, addComment);

router.put("/:pid/comments/:cid", ensureAuthenticated, editComment);

router.delete("/:pid/comments/:cid", ensureAuthenticated, deleteComment);

router.post("/:pid/likes", ensureAuthenticated, likePost);

router.delete("/:pid/likes", ensureAuthenticated, unlikePost);

export default router;
