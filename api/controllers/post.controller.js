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

//Get Post API Routes
export const getPosts = async (req, res, next) => {
  try {
    const startIndex = parseInt(req?.query?.startIndex) || 0;
    const limit = parseInt(req?.query?.limit) || 9;
    console.log("req.query", req?.query);
    console.log("startIndex", startIndex, "limit", limit);
    const sortDirection = req?.query?.order === "asc" ? 1 : -1;
    const posts = await Post.find({
      ...(req?.query?.userId && { userId: req?.query?.userId }),
      ...(req?.query?.category && { category: req?.query?.category }),
      ...(req?.query?.slug && { slug: req?.query?.slug }),
      ...(req?.query?.postId && { _id: req?.query?.postId }),
      ...(req?.query?.searchTerm && {
        $or: [
          { title: { $regex: req?.query?.searchTerm, $options: "i" } },
          { content: { $regex: req?.query?.searchTerm, $options: "i" } },
        ],
      }),
    })
      .sort({ updateAt: sortDirection })
      .skip(startIndex)
      .limit(limit);
    const totalPosts = await Post.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastmonthPosts = await Post.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });
    res.status(200).json({
      posts,
      totalPosts,
      lastmonthPosts,
    });
  } catch (error) {
    next(error);
  }
};

//Delete Post API Routes
export const deletePosts = async (req, res, next) => {
  if (!req.user.isAdmin || req.user?.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to delete this post"));
  }
  try {
    await Post.findByIdAndDelete(req?.params?.postId);
    res.status(200).json("The Post has been deleted");
  } catch (error) {
    console.log(error);
    next(error);
  }
};

//Update Post API Routes
export const updatePosts = async (req, res, next) => {
  if (!req.user.isAdmin || req.user?.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to update this post"));
  }
  try {
    const findPost = await Post.findById(req?.params?.postId);
    console.log("findPost", findPost);

    const oldslug = findPost?.slug;
    console.log("oldslug", oldslug);

    const updatedslug = req?.body?.title
      ?.split(" ")
      ?.join("-")
      ?.toLowerCase()
      .replace(/[^a-zA-Z0-9-]/g, "");
    console.log("updatedslug", updatedslug);
    const updatePost = await Post.findByIdAndUpdate(
      req?.params?.postId,
      {
        $set: {
          title: req?.body?.title,
          content: req?.body?.content,
          category: req?.body?.category,
          image: req?.body?.image,
          slug: req?.body?.title ? updatedslug : oldslug,
        },
      },
      { new: true }
    );
    console.log("updatePost", updatePost);
    res.status(200).json(updatePost);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
