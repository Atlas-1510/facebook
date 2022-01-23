import { Router } from "express";
import usersRouter from "./users/users";
import authRouter from "./auth/auth";
import postsRouter from "./posts/posts";
import friendRequestsRouter from "./friendRequests/friendRequests";

const router = Router();

router.use("/auth", authRouter);
router.use("/api/users", usersRouter);
router.use("/api/posts", postsRouter);
router.use("/api/friendRequests", friendRequestsRouter);

export default router;
