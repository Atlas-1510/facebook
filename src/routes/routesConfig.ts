import { Router } from "express";
import usersRouter from "./users/users";
import loginRouter from "./login/login";
import postsRouter from "./posts/posts";
import friendRequestsRouter from "./friendRequests/friendRequests";

const router = Router();

router.use("/login", loginRouter);
router.use("/api/users", usersRouter);
router.use("/api/posts", postsRouter);
router.use("/api/friendRequests", friendRequestsRouter);

export default router;
