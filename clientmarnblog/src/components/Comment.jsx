import axios from "axios";
import { Alert, Spinner } from "flowbite-react";
import React, { useEffect, useState } from "react";
import moment from "moment";

const Comment = ({ comment }) => {
  const [getUsers, setGetUsers] = useState("");
  const [getUsersError, setGetUsersError] = useState(null);
  const [getUsersLoaing, setGetUsersLoading] = useState(false);
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
        <div className="flex p-4 dark:border-gray-600  text-sm">
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
            <p className="text-gray-500 mb-2">{comment.content}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Comment;
