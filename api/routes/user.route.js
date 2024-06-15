import express from "express";
import { test } from "../controllers/user.controller.js";
import { updateUser } from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

//Test API Route
router.get("/test", test);

//Update user profile API Route
router.put("/update/:userId", verifyToken, updateUser);

export default router;
