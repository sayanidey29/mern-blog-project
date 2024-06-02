import express from "express";
import { signup } from "../controllers/auth.controller.js";

const router = express.Router();

//Auth API Route
router.post("/signup", signup);

export default router;
