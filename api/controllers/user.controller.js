import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";
//Test API Route
export const test = (req, res) => {
  res.json({ messaage: "API is working" });
};

//Update user profile API Route
export const updateUser = async (req, res, next) => {
  // console.log("request", req);
  console.log("User details from cookie ", req?.user);
  console.log("User id from frontend ", req?.params);
  console.log("request body", req?.body);
  if (req?.user?.id !== req?.params?.userId) {
    return next(errorHandler(403, "You are not allowed to update this user"));
  }
  if (req?.body?.password) {
    if (req?.body?.password?.length < 6) {
      return next(errorHandler(400, "Password must be at less 6 characters"));
    }
    if (req?.body?.password?.includes(" ")) {
      return next(errorHandler(400, "Password cannot contain spaces"));
    }
    req.body.password = bcryptjs.hashSync(req?.body?.password, 10);
  }
  if (req?.body?.username) {
    if (req?.body?.username?.length < 7 || req?.body?.username?.length > 20) {
      return next(
        errorHandler(400, "Username must be between 7 and 20 characters")
      );
    }
    if (req?.body?.username?.includes(" ")) {
      return next(errorHandler(400, "Username cannot contain spaces"));
    }
    if (req?.body?.username !== req?.body?.username.toLowerCase()) {
      return next(errorHandler(400, "Username must be lowercase"));
    }
    if (!req?.body?.username.match(/^[a-zA-Z0-9]+$/)) {
      return next(
        errorHandler(400, "Username can only contain letters and numbers")
      );
    }
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          profilePicture: req.body.profilePicture,
        },
      },
      { new: true }
    );
    console.log("updatedUser", updatedUser);
    const { password, ...rest } = updatedUser?._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

//Delete user profile API Route
export const deleteUser = async (req, res, next) => {
  if (!req?.user?.isAdmin && req?.user?.id !== req?.params?.userId) {
    return next(errorHandler(403, "You are not allowed to delete this user"));
  }

  try {
    await User.findByIdAndDelete(req?.params?.userId);
    if (req?.user?.isAdmin) {
      //for admin no need to clear the cookie
      res.status(200).json("User Account has been deleted");
    } else if (req?.user?.isAdmin && req?.user?.id === req?.params?.userId) {
      res
        .clearCookie("access_token") //added cookie clear line on my own
        .status(200)
        .json("User Account has been deleted");
    } else {
      res
        .clearCookie("access_token") //added cookie clear line on my own
        .status(200)
        .json("User Account has been deleted");
    }
  } catch (error) {
    next(error);
  }
};

//signout user profile API Route
export const signout = async (req, res, next) => {
  try {
    res
      .clearCookie("access_token")
      .status(200)
      .json("User has been signed out");
  } catch (error) {
    next(error);
  }
};

//Get user profile API Route
export const getUsers = async (req, res, next) => {
  if (!req?.user?.isAdmin) {
    console.log(req);
    return next(errorHandler(403, "You are not allowed to see all users"));
  }
  try {
    const startIndex = parseInt(req?.query?.startIndex) || 0;
    const limit = parseInt(req?.query?.limit) || 9;
    const sortDirection = req?.body?.sort === "asc" ? 1 : -1;
    const users = await User.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);
    const usersWithOutPassword = users?.map((user) => {
      const { password, ...rest } = user?._doc;
      return rest;
    });
    const totalUsers = await User.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthUsers = await User.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });
    res.status(200).json({
      users: usersWithOutPassword,
      totalUsers,
      lastMonthUsers,
    });
  } catch (error) {
    next(error);
  }
};

////Get user for comment API Route
export const getUsersComment = async (req, res, next) => {
  try {
    const getUser = await User.findById(req.params.userId);
    if (!getUser) {
      return next(errorHandler(404, "User not Found"));
    }
    res.status(200).json(getUser);
  } catch (error) {
    next(error);
  }
};
