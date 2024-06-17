import { errorHandler } from "../utils/error.js";
import Comment from "../models/comment.model.js";

//create comment API Route
export const createComment = async (req, res, next) => {
  try {
    const { content, postId, userId } = req.body;
    //if commented user and logged in user is not same
    if (userId !== req.user.id) {
      return next(
        errorHandler(403, "You are not allowed to comment in the Post")
      );
    }
    const newComment = new Comment({
      content,
      postId,
      userId,
    });
    await newComment.save();
    res.status(200).json(newComment);
  } catch (error) {
    return next(error);
  }
};
