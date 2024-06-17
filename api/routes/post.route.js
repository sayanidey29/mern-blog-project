import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  createPost,
  updatePosts,
  getPosts,
  deletePosts,
} from "../controllers/post.controller.js";

const router = express.Router();

//Create Post API Routes
router.post("/createPost", verifyToken, createPost);

//Get Post API Routes
router.get("/getPosts", getPosts);

//Delete Post API Routes
router.delete("/deletePosts/:postId/:userId", verifyToken, deletePosts);

//Update Post API Routes
router.put("/updatePosts/:postId/:userId", verifyToken, updatePosts);

export default router;
