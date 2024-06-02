import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";

dotenv.config();

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("mongoDB is connected");
  })
  .catch((err) => {
    console.log("Error:", err);
  });

const app = express();

app.use(express.json());

app.listen(3000, () => {
  console.log("server is running on port 3000");
});

//Test API Route
app.use("/api/user", userRoutes);

//Auth API Route
app.use("/api/auth", authRoutes);
