import axios from "axios";
import { Alert, Spinner, Textarea, Button } from "flowbite-react";
import React, { useEffect, useState } from "react";
import moment from "moment";
import { FaThumbsUp, FaThumbsDown, FaHeart } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Comment = ({ comment, onLike, onDisLike, onLove, onEdit, onDelete }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [getUsers, setGetUsers] = useState("");
  const [getUsersError, setGetUsersError] = useState(null);
  const [getUsersLoaing, setGetUsersLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const navigate = useNavigate();
  console.log("one comment", comment);
  useEffect(() => {
    const getUser = async () => {
      try {
        setGetUsersError(null);
        setGetUsersLoading(true);
        const res = await axios.get(
          `/api/user/getUsersComment/${comment.userId}`
        );
        const data = await res.data;
        console.log("getusercom", data);
        setGetUsersLoading(false);
        if (data?.success === false) {
          setGetUsersError(data?.message);
          setGetUsersLoading(false);
          setGetUsers(null);
          console.log(data?.message);
          return;
        }
        if (res?.statusText?.toLowerCase() === "ok") {
          setGetUsers(data);
          setGetUsersError(null);
          setGetUsersLoading(false);
          console.log(data);
        }
      } catch (error) {
        setGetUsersError(error?.message);
        setGetUsersLoading(false);
        console.log(error);
        return;
      }
    };
    getUser();
  }, [comment]);

  const handleEditComment = () => {
    setIsEditing(true);
    setEditedContent(comment.content);
  };
  const handleSave = async () => {
    try {
      if (!currentUser) {
        navigate("/sign-in");
      }
      const res = await axios.put(`/api/comment/updateComment/${comment._id}`, {
        content: editedContent,
      });
      const data = res.data;
      console.log("edit", res);
      if (data?.success === false) {
        console.log(data?.message);
        return;
      }
      if (res?.statusText?.toLowerCase() === "ok") {
        setIsEditing(false);
        onEdit(comment, editedContent);
      }
    } catch (error) {
      console.log(error);
      return;
    }
  };

  return (
    <div>
      {getUsersError && (
        <Alert color="failure" className="mt-5">
          {getUsersError}
        </Alert>
      )}
      {getUsersLoaing ? (
        <div>
          <Spinner />
          <span>Loading...</span>
        </div>
      ) : (
        <div className="flex p-4 border-b dark:border-gray-600  text-sm">
          <div className="flex-shrink-0 mr-3">
            <img
              className="w-10 h-10 rounded-full bg-gray-200"
              src={getUsers?.profilePicture}
              alt={getUsers?.username}
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center mb-1">
              <span className="font-bold mr-1 text-xs truncate">
                {getUsers ? `@${getUsers?.username}` : "anonymous user"}
              </span>
              <span className="text-gray-500 text-xs">
                {moment(comment.createdAt).fromNow()}
              </span>
            </div>
            {isEditing ? (
              <>
                <Textarea
                  className="mb-2"
                  maxLength="200"
                  onChange={(e) => setEditedContent(e.target.value)}
                  value={editedContent}
                />
                <div className="flex justify-end gap-2 text-sm">
                  <Button
                    type="button"
                    size="sm"
                    gradientDuoTone="purpleToBlue"
                    onClick={handleSave}
                  >
                    Save
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    gradientDuoTone="purpleToBlue"
                    onClick={() => {
                      setIsEditing(false);
                      setEditedContent(comment.content);
                    }}
                  >
                    Cancle
                  </Button>
                </div>
              </>
            ) : (
              <>
                <p className="text-gray-500 mb-2 ">{comment.content}</p>

                <div className="border-b pb-2 mb-2 max-w-[20rem] dark:border-gray-700"></div>

                <div className="flex h-[2.5rem] max-w-[20rem] ">
                  <div className=" flex flex-col gap-1 items-center  justify-center w-full flex-1">
                    <button
                      type="button"
                      onClick={() => onLike(comment._id)}
                      className={`text-gray-400 hover:text-blue-500 flex flex-1 items-center  justify-center ${
                        currentUser &&
                        comment.likes?.includes(currentUser._id) &&
                        "!text-blue-500"
                        //: "!text-gray-400"
                      }`}
                    >
                      <FaThumbsUp className="text-sm" />
                    </button>
                    <p className="text-gray-400 text-sm flex flex-1 items-center  justify-center">
                      {comment.numberOfLikes > 0 &&
                        comment.numberOfLikes +
                          " " +
                          (comment.numberOfLikes === 1 ? "like" : "likes")}
                    </p>
                  </div>
                  <div className="flex flex-col items-center gap-1 justify-center  w-full  flex-1">
                    <button
                      type="button"
                      onClick={() => onLove(comment._id)}
                      className={`text-gray-400 hover:text-red-500 flex flex-1 items-center  justify-center ${
                        currentUser &&
                        comment.loves?.includes(currentUser._id) &&
                        "!text-red-500"
                        //: "!text-gray-400"
                      }`}
                    >
                      <FaHeart className="text-sm " />
                    </button>
                    <p className="text-gray-400 text-sm flex flex-1 items-center  justify-center">
                      {comment.numberOfLoves > 0 &&
                        comment.numberOfLoves +
                          " " +
                          (comment.numberOfLoves === 1 ? "love" : "loves")}
                    </p>
                  </div>
                  <div className="flex flex-col items-center gap-1 justify-center  w-full flex-1">
                    <button
                      type="button"
                      onClick={() => onDisLike(comment._id)}
                      className={`text-gray-400 hover:text-blue-500 flex flex-1 items-center  justify-center ${
                        currentUser &&
                        comment.dislikes?.includes(currentUser._id) &&
                        "!text-blue-500"
                        //: "!text-gray-400"
                      }`}
                    >
                      <FaThumbsDown className="text-sm" />
                    </button>
                    <p className="text-gray-400 text-sm flex flex-1 items-center  justify-center">
                      {comment.numberOfDisLikes > 0 &&
                        comment.numberOfDisLikes +
                          " " +
                          (comment.numberOfDisLikes === 1
                            ? "dislike"
                            : "dislikes")}
                    </p>
                  </div>
                  {currentUser &&
                    (currentUser._id === comment.userId ||
                      currentUser.isAdmin) && (
                      <>
                        <div className="flex flex-col items-center gap-1 justify-center  w-full flex-1 hover:text-blue-500 ">
                          <button
                            type="button"
                            onClick={handleEditComment}
                            className="text-gray-400 hover:text-blue-500 flex flex-1  justify-center "
                          >
                            Edit
                          </button>
                        </div>
                        <div className="flex flex-col items-center gap-1 justify-center  w-full flex-1 hover:text-blue-500 ">
                          <button
                            type="button"
                            onClick={() => onDelete(comment)}
                            className="text-gray-400 hover:text-red-500 flex flex-1  justify-center "
                          >
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Comment;
