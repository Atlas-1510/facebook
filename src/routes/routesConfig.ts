import { Router } from "express";
import usersRouter from "./users/users";

const router = Router();

router.use("/users", usersRouter);

export default router;
