import { Router } from "express";
import { getNewsfeedPosts } from "../../controllers/posts/posts";

const router = Router();

router.get("/newsfeed/:uid", getNewsfeedPosts);

export default router;
