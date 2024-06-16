import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { createPost } from "../controllers/post.controller.js";
import { getPosts } from "../controllers/post.controller.js";
import { deletePosts } from "../controllers/post.controller.js";

const router = express.Router();

//Create Post API Routes
router.post("/createPost", verifyToken, createPost);

//Get Post API Routes
router.get("/getPosts", getPosts);

//Delete Post API Routes
router.get("/deletePosts/:postId/:userId", verifyToken, deletePosts);

export default router;
