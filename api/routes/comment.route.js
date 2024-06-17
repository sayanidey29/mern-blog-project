import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { createComment } from "../controllers/comment.controller.js";

const router = express.Router();

//create comment API Route
router.post("/createComment", verifyToken, createComment);

export default router;
