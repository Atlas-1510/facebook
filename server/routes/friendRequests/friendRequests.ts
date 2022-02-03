import { Router } from "express";
import { ensureAuthenticated } from "../../controllers/authentication/authentication";
import {
  sendRequest,
  deleteRequest,
  handleRequest,
  removeFriend,
} from "../../controllers/friendRequests/friendRequests";

const router = Router();

router.post("/", ensureAuthenticated, sendRequest);

router.delete("/", ensureAuthenticated, deleteRequest);

router.post("/handle", ensureAuthenticated, handleRequest);

router.delete("/friends", ensureAuthenticated, removeFriend);

export default router;
