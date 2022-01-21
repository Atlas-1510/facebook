import { Router } from "express";
import { ensureAuthenticated } from "../../controllers/authentication/authentication";
import {
  sendRequest,
  deleteRequest,
  handleRequest,
  getRequests,
} from "../../controllers/friendRequests/friendRequests";

const router = Router();

router.get("/", ensureAuthenticated, getRequests);

router.post("/", ensureAuthenticated, sendRequest);

router.delete("/", ensureAuthenticated, deleteRequest);

router.post("/handle", ensureAuthenticated, handleRequest);

export default router;
