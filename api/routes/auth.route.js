import express from "express";
import { signin, signup } from "../controllers/auth.controller.js";

const router = express.Router();

//Auth API Route for SignUp
router.post("/signup", signup);
//Auth API Route for SignIn
router.post("/signin", signin);

export default router;
