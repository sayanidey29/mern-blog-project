import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  createComment,
  deleteComment,
  dislikeComment,
  getComment,
  likeComment,
  loveComment,
  updateComment,
  getAllPostComments,
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

//update comment API Route
router.put("/updateComment/:commentId", verifyToken, updateComment);

//delete comment API Route
router.delete("/deleteComment/:commentId", verifyToken, deleteComment);

//get All post comments API Route
router.get("/getAllPostComments", verifyToken, getAllPostComments);

export default router;
