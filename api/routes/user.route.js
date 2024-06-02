import express from "express";
import { test } from "../controllers/user.controller.js";

const router = express.Router();

//Test API Route
router.get("/test", test);

export default router;
