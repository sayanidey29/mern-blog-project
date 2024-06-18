import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import postRoutes from "./routes/post.route.js";
import commentRoutes from "./routes/comment.route.js";
import cookieParser from "cookie-parser";
import path from "path";

dotenv.config();

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("mongoDB is connected");
  })
  .catch((err) => {
    console.log("Error:", err);
  });

const __dirname = path.resolve();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.listen(3000, () => {
  console.log("server is running on port 3000");
});

//Test API Route
app.use("/api/user", userRoutes);

//Auth API Route
app.use("/api/auth", authRoutes);

//Post API Route
app.use("/api/post", postRoutes);

//Comment ApI Route
app.use("/api/comment", commentRoutes);

app.use(express.static(path.join(__dirname, "/clientmarnblog/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "clientmarnblog", "dist", "index.html"));
});

//ERROR HANDLER MIDDLEWARE
app.use((err, req, res, next) => {
  // console.log("middleware error", err, "middleware error msg", err.message);
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
