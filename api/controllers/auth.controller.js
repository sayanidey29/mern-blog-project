import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
//Auth API Route
export const signup = async (req, res) => {
  console.log("req.body:", req.body);
  // console.log("request:", req);
  // console.log("response", res);
  const { username, email, password } = req.body;
  if (
    !username ||
    !email ||
    !password ||
    username === "" ||
    email === "" ||
    password === ""
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const hashPassword = bcryptjs.hashSync(password, 10);

  const newUser = new User({ username, email, password: hashPassword });
  try {
    await newUser.save();
    res.json("Signup Successful");
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
