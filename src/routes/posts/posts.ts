import { Router } from "express";
import { getNewsfeedPosts, getPost } from "../../controllers/posts/posts";

const router = Router();

router.get("/newsfeed/:uid", getNewsfeedPosts);

router.get("/:pid", getPost);

export default router;
