import { Router } from "express";
import usersRouter from "./users/users";
import loginRouter from "./login/login";

const router = Router();

router.use("/login", loginRouter);
router.use("/users", usersRouter);

export default router;
