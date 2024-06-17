import { useSelector } from "react-redux";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button, TextInput, Textarea, Spinner, Alert } from "flowbite-react";
import axios from "axios";

const CommentSection = ({ postId }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [comments, setComments] = useState("");
  const [commentError, setCommentError] = useState(null);
  const [commentLoaing, setCommentLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (comments.length > 200) {
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
      if (res?.statusText?.toLowerCase() === "ok") {
        console.log("data commment", data);
        setCommentError(null);
        setComments("");
      }
    } catch (error) {
      setCommentLoading(false);
      setCommentError(error);
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
              {200 - comments.length} charecters remaining
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
    </div>
  );
};

export default CommentSection;
