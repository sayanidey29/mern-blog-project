import { errorHandler } from "../utils/error.js";
import Post from "../models/post.model.js";

//Create Post API Routes
export const createPost = async (req, res, next) => {
  if (!req?.user?.isAdmin) {
    return next(errorHandler(403, "You are not allowed to create a post"));
  }
  if (!req?.body?.title || !req?.body?.content) {
    return next(errorHandler(400, "Please Provide all required fields"));
  }
  const slug = req?.body?.title
    ?.split(" ")
    ?.join("-")
    ?.toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, "");
  const newPost = new Post({
    ...req?.body,
    slug,
    userId: req?.user?.id,
  });
  try {
    const savePost = await newPost.save();
    res.status(200).json({
      success: true,
      post: savePost,
    });
  } catch (error) {
    next(error);
  }
};
