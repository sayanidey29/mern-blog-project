import express from "express";
import { signin, signup, google } from "../controllers/auth.controller.js";

const router = express.Router();

//Auth API Route for SignUp
router.post("/signup", signup);
//Auth API Route for SignIn
router.post("/signin", signin);
//Auth API Route for Google
router.post("/google", google);

export default router;
