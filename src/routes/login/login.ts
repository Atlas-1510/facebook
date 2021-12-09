import { Router } from "express";

const router = Router();

router.post("/", (req, res, next) => {
  res.send("returned from login route");
});

export default router;
