import express from "express";
import {
  deleteUser,
  updateUser,
  test,
} from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

//Test API Route
router.get("/test", test);

//Update user profile API Route
router.put("/update/:userId", verifyToken, updateUser);

//delete user profile API Route
router.delete("/delete/:userId", verifyToken, deleteUser);

export default router;
