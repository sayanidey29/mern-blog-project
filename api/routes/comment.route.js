import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  createComment,
  dislikeComment,
  getComment,
  likeComment,
  loveComment,
} from "../controllers/comment.controller.js";

const router = express.Router();

//create comment API Route
router.post("/createComment", verifyToken, createComment);

//get comment API Route
router.get("/getComment/:postId", getComment);

//like comment API Route
router.put("/likeComment/:commentId", verifyToken, likeComment);

//love comment API Route
router.put("/loveComment/:commentId", verifyToken, loveComment);

//dislike comment API Route
router.put("/dislikeComment/:commentId", verifyToken, dislikeComment);

export default router;
