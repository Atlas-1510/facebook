import { Router } from "express";
import { ensureAuthenticated } from "../../controllers/authentication/authentication";
import {
  sendRequest,
  deleteRequest,
  handleRequest,
} from "../../controllers/friendRequests/friendRequests";

const router = Router();

router.post("/", ensureAuthenticated, sendRequest);

router.delete("/", ensureAuthenticated, deleteRequest);

router.post("/handle", ensureAuthenticated, handleRequest);

export default router;
