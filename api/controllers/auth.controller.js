import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";
//Auth API Route for SignUp
export const signup = async (req, res, next) => {
  console.log("request_body:", req.body);
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
    // return res.status(400).json({ message: "All fields are required" });
    next(errorHandler(400, "All fields are required"));
  }

  const hashPassword = bcryptjs.hashSync(password, 10);

  const newUser = new User({ username, email, password: hashPassword });
  try {
    await newUser.save();
    // res.json("Signup Successful");
    const statusCode = res?.statusCode || 200;
    const message = res?.message || "Signup Successful";
    res.json({
      success: true,
      statusCode,
      message,
    });
  } catch (error) {
    // console.log("catch", error);
    // return res.status(500).json({ message: error.message });
    next(error);
  }
};

//Auth API Route for SignIn
export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password || email === "" || password === "") {
    next(errorHandler(400, "All fields are required"));
  }
  try {
    const validUser = await User.findOne({ email });
    console.log("validUser", validUser);
    if (!validUser) {
      return next(errorHandler(400, "User not found")); //write the return statement so it do not go to next line after error
    }
    const validPassword = bcryptjs.compareSync(password, validUser?.password);
    console.log("validPassword", validPassword);
    if (!validPassword) {
      return next(errorHandler(400, "Invalid Password")); //write the return statement so it do not go to next line after error
    }
    const token = jwt.sign({ id: validUser?._id }, process.env.JWT_SECRET);
    console.log("token", token);
    console.log("validUser._doc", validUser?._doc);
    const { password: pass, ...rest } = validUser._doc;
    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .json(rest);
  } catch (error) {
    next(error);
  }
};
