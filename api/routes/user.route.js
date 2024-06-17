import express from "express";
import {
  deleteUser,
  updateUser,
  signout,
  test,
  getUsers,
  getUsersComment,
} from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

//Test API Route
router.get("/test", test);

//Update user profile API Route
router.put("/update/:userId", verifyToken, updateUser);

//delete user profile API Route
router.delete("/delete/:userId", verifyToken, deleteUser);

//signout user profile API Route
router.post("/signout", signout);

//Get user profile API Route
router.get("/getUsers", verifyToken, getUsers);

////Get user for comment API Route
router.get("/getUsersComment/:userId", getUsersComment);

export default router;
