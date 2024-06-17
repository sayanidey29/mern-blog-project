import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  createComment,
  getComment,
} from "../controllers/comment.controller.js";

const router = express.Router();

//create comment API Route
router.post("/createComment", verifyToken, createComment);

//get comment API Route
router.get("/getComment/:postId", getComment);

export default router;
