import { Router } from "express";
import {
  editPost,
  getNewsfeedPosts,
  getPost,
} from "../../controllers/posts/posts";

// TODO: Clarify if need to add "ensureAuthenticated" to these routes. As these will be accessed via front end, may be able to use CORS
// to prevent unauthorized access (i.e one user requesting the newsfeed of a different user). For future reference, the way to see if a
// user session exists (on the server) is at req.session.passport.user

const router = Router();

router.get("/newsfeed/:uid", getNewsfeedPosts);

router.get("/:pid", getPost);

router.put("/:pid", editPost);

export default router;
