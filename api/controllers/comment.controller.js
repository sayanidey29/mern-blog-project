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

//get comment API Route
export const getComment = async (req, res, next) => {
  try {
    const getComments = await Comment.find({ postId: req.params.postId }).sort({
      createdAt: -1,
    });
    res.status(200).json(getComments);
  } catch (error) {
    next(error);
  }
};

//like comment API Route
export const likeComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return next(errorHandler(404, "Comment Not Found!!!"));
    }
    const likesuserIndex = comment.likes.indexOf(req.user.id);
    const indexdislike = comment.dislikes.indexOf(req.user.id);
    const indexlove = comment.loves.indexOf(req.user.id);
    // console.log("req.user cookie", req.user);

    if (likesuserIndex === -1) {
      comment.numberOfLikes += 1;
      comment.likes.push(req.user.id);
      if (indexdislike !== -1) {
        comment.numberOfDisLikes -= 1;
        comment.dislikes.splice(indexdislike, 1);
      }
      if (indexlove !== -1) {
        comment.numberOfLoves -= 1;
        comment.loves.splice(indexlove, 1);
      }
    } else {
      comment.numberOfLikes -= 1;
      comment.likes.splice(likesuserIndex, 1);
    }
    await comment.save();
    res.status(200).json(comment);
  } catch (error) {
    next(error);
  }
};

//love comment API Route
export const loveComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return next(errorHandler(404, "Comment Not Found!!!"));
    }
    const lovesuserIndex = comment.loves.indexOf(req.user.id);
    const indexlike = comment.likes.indexOf(req.user.id);
    const indexdislike = comment.dislikes.indexOf(req.user.id);

    if (lovesuserIndex === -1) {
      comment.numberOfLoves += 1;
      comment.loves.push(req.user.id);
      if (indexdislike !== -1) {
        comment.numberOfDisLikes -= 1;
        comment.dislikes.splice(indexdislike, 1);
      }
      if (indexlike !== -1) {
        comment.numberOfLikes -= 1;
        comment.likes.splice(indexlike, 1);
      }
    } else {
      comment.numberOfLoves -= 1;
      comment.loves.splice(lovesuserIndex, 1);
    }
    await comment.save();
    res.status(200).json(comment);
  } catch (error) {
    next(error);
  }
};

//dislike comment API Route
export const dislikeComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return next(errorHandler(404, "Comment Not Found!!!"));
    }
    const dislikeuserIndex = comment.dislikes.indexOf(req.user.id);
    const indexlike = comment.likes.indexOf(req.user.id);
    const indexlove = comment.loves.indexOf(req.user.id);

    if (dislikeuserIndex === -1) {
      comment.numberOfDisLikes += 1;
      comment.dislikes.push(req.user.id);
      if (indexlove !== -1) {
        comment.numberOfLoves -= 1;
        comment.loves.splice(indexlove, 1);
      }
      if (indexlike !== -1) {
        comment.numberOfLikes -= 1;
        comment.likes.splice(indexlike, 1);
      }
    } else {
      comment.numberOfDisLikes -= 1;
      comment.dislikes.splice(dislikeuserIndex, 1);
    }
    await comment.save();
    res.status(200).json(comment);
  } catch (error) {
    next(error);
  }
};

//update comment API Route
export const updateComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return next(errorHandler(404, "Comment not found"));
    }
    if (comment.userId !== req.user.id && !req.user.isAdmin) {
      return next(
        errorHandler(403, "You are not allowed to edit this comment")
      );
    }
    const editedComment = await Comment.findByIdAndUpdate(
      req.params.commentId,
      {
        content: req.body.content,
      },
      { new: true }
    );
    res.status(200).json(editedComment);
  } catch (error) {
    next(error);
  }
};

//delete comment API Route
export const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return next(errorHandler(404, "Comment not found"));
    }
    if (comment.userId !== req.user.id && !req.user.isAdmin) {
      return next(
        errorHandler(403, "You are not allowed to delete this comment")
      );
    }
    await Comment.findByIdAndDelete(req.params.commentId);
    res.status(200).json("Comment has been deleted");
  } catch (error) {
    next(error);
  }
};
