import { useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  TextInput,
  Textarea,
  Spinner,
  Alert,
  Modal,
} from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import axios from "axios";
import Comment from "./Comment";
import { set } from "mongoose";

const CommentSection = ({ postId }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [comments, setComments] = useState("");
  const [commentError, setCommentError] = useState(null);
  const [commentLoaing, setCommentLoading] = useState(false);
  const [getComments, setGetComments] = useState("");
  const [getcommentError, setGetCommentError] = useState(null);
  const [getcommentLoaing, setGetCommentLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const navigate = useNavigate();

  console.log(getComments);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (comments?.length > 200) {
      return;
    }
    try {
      setCommentLoading(true);
      setCommentError(null);
      const res = await axios.post("/api/comment/createComment", {
        content: comments,
        postId: postId,
        userId: currentUser?._id,
      });
      const data = await res?.data;
      setCommentLoading(false);
      if (data.success === false) {
        setCommentError(data.message);
        return;
      }
      if (res?.status === 200) {
        console.log("data commment", data);
        setCommentError(null);
        setComments("");
        setGetComments([data, ...getComments]);
      }
    } catch (error) {
      setCommentLoading(false);
      setCommentError(error?.message);
      return;
    }
  };

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setCommentLoading(true);
        setGetCommentError(null);
        const res = await axios.get(`/api/comment/getComment/${postId}`);
        const data = await res.data;
        setCommentLoading(false);
        if (data?.success === false) {
          setGetCommentError(data?.message);
          return;
        }
        console.log("res", res);
        if (res?.status === 200) {
          console.log("com", data);
          setGetComments(data);
          setGetCommentError(null);
        }
      } catch (error) {
        setCommentLoading(false);
        setGetCommentError(error?.message);
        console.log(error, error?.message);
        return;
      }
    };
    fetchComments();
  }, [postId]);

  const handleLike = async (commentId) => {
    try {
      if (!currentUser) {
        navigate("/sign-in");
        return;
      }
      const res = await axios.put(`/api/comment/likeComment/${commentId}`);
      const data = await res.data;
      console.log(data);
      if (data?.success === false) {
        console.log(data?.message);
        return;
      }
      if (res?.status === 200) {
        console.log(data);
        setGetComments(
          getComments.map((comment) =>
            comment?._id === commentId
              ? {
                  ...comment,
                  likes: data.likes,
                  numberOfLikes: data.numberOfLikes,
                  dislikes: data.dislikes,
                  numberOfDisLikes: data.numberOfdisLikes,
                  loves: data.loves,
                  numberOfLoves: data.numberOfLoves,
                }
              : comment
          )
        );
      }
    } catch (error) {
      console.log(error);
      return;
    }
  };
  const handleLove = async (commentId) => {
    try {
      if (!currentUser) {
        navigate("/sign-in");
        return;
      }
      const res = await axios.put(`/api/comment/loveComment/${commentId}`);
      const data = await res.data;
      if (data?.success === false) {
        console.log(data?.message);
        return;
      }
      if (res?.status === 200) {
        console.log(data);
        setGetComments(
          getComments.map((comment) =>
            comment?._id === commentId
              ? {
                  ...comment,
                  likes: data.likes,
                  numberOfLikes: data.numberOfLikes,
                  dislikes: data.dislikes,
                  numberOfDisLikes: data.numberOfdisLikes,
                  loves: data.loves,
                  numberOfLoves: data.numberOfLoves,
                }
              : comment
          )
        );
      }
    } catch (error) {
      console.log(error);
      return;
    }
  };
  const handleDisLike = async (commentId) => {
    try {
      if (!currentUser) {
        navigate("/sign-in");
        return;
      }
      const res = await axios.put(`/api/comment/dislikeComment/${commentId}`);
      const data = await res.data;
      if (data?.success === false) {
        console.log(data?.message);
        return;
      }
      if (res?.status === 200) {
        console.log(data);

        setGetComments(
          getComments.map((comment) =>
            comment?._id === commentId
              ? {
                  ...comment,
                  likes: data.likes,
                  numberOfLikes: data.numberOfLikes,
                  dislikes: data.dislikes,
                  numberOfDisLikes: data.numberOfDisLikes,
                  loves: data.loves,
                  numberOfLoves: data.numberOfLoves,
                }
              : comment
          )
        );
      }
    } catch (error) {
      console.log(error);
      return;
    }
  };

  const handleEdit = async (comment, editedContent) => {
    setGetComments(
      getComments.map((c) =>
        c?._id === comment?._id ? { ...c, content: editedContent } : c
      )
    );
  };

  const handleDelete = async (comment) => {
    try {
      if (!currentUser) {
        navigate("/sign-in");
      }
      const res = await axios.delete(
        `/api/comment/deleteComment/${comment?._id}`
      );
      const data = await res.data;
      if (data?.success === false) {
        console.log(data?.message);
        return;
      }
      if (res?.status === 200) {
        console.log(data);
        setGetComments(getComments.filter((c) => c?._id !== comment?._id));
        setShowModal(false);
      }
    } catch (error) {
      console.log(error);
      return;
    }
  };

  return (
    <div className="max-w-2xl mx-auto w-full p-3">
      {currentUser ? (
        <div className="flex items-center gap-1 my-5 text-gray-500 text-sm">
          <p>Signed in as:</p>
          <img
            className="h-5 w-5 object-cover rounded-full"
            src={currentUser.profilePicture}
            alt={currentUser.username}
          />
          <Link
            to={"/dashboard?tab=profile"}
            className="text-xs  text-cyan-600 hover:underline"
          >
            @{currentUser.username}
          </Link>
        </div>
      ) : (
        <div className="text-sm text-teal-500 my-5 flex gap-1 font-semibold">
          You must be signed in to comment.
          <Link className="text-blue-500 hover:underline" to={"/sign-in"}>
            Sign In
          </Link>
        </div>
      )}
      {currentUser && (
        <form
          className="border border-teal-500 rounded-md p-5"
          onSubmit={handleSubmit}
        >
          <Textarea
            placeholder="Add a comment..."
            rows="3"
            maxLength="200"
            onChange={(e) => setComments(e.target.value)}
            value={comments}
            disabled={commentLoaing}
          />
          <div className="flex justify-between items-center mt-5">
            <p className="text-gray-500 text-xs ">
              {200 - comments?.length} charecters remaining
            </p>
            <Button
              outline
              gradientDuoTone="purpleToBlue"
              type="submit"
              disabled={commentLoaing}
            >
              {commentLoaing ? (
                <div>
                  <Spinner />
                  <span>Posting...</span>
                </div>
              ) : (
                "Submit"
              )}
            </Button>
          </div>
          {commentError && (
            <Alert color="failure" className="mt-5">
              {commentError}
            </Alert>
          )}
        </form>
      )}
      {getcommentLoaing ? (
        <div>
          <Spinner />
          <span>Loading...</span>
        </div>
      ) : getComments?.length === 0 ? (
        <p className="text-sm my-5">No Comments Yet!</p>
      ) : (
        <div>
          <div className="text-xs my-5 flex items-center gap-1">
            <p>Comments</p>
            <div className="border border-gray-400 py-1 px-2 rounded-sm ">
              {getComments?.length}
            </div>
          </div>
          {getComments.map((comment) => {
            return (
              <Comment
                comment={comment}
                key={comment?._id}
                onLike={handleLike}
                onLove={handleLove}
                onDisLike={handleDisLike}
                onEdit={handleEdit}
                onDelete={(comment) => {
                  setShowModal(true);
                  setCommentToDelete(comment);
                }}
              />
            );
          })}
        </div>
      )}
      {getcommentError && (
        <Alert color="failure" className="mt-5">
          {getcommentError}
        </Alert>
      )}

      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="w-14 h-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete comment?
            </h3>
          </div>
          <div className="flex justify-center gap-16">
            <Button
              color="failure"
              onClick={() => handleDelete(commentToDelete)}
            >
              Yes, I'm sure
            </Button>
            <Button color="gray" onClick={() => setShowModal(false)}>
              No, Cancel
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default CommentSection;
