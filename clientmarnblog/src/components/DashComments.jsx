import { Table, Modal, Button } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { FaCheck, FaTimes } from "react-icons/fa";

const DashComments = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [postComments, setPostComments] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [showLess, setShowLess] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [commentIdToDelete, setCommentIdToDelete] = useState("");
  console.log("postComments", postComments);
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/comment/getAllPostComments`);
        const data = await res.json();
        console.log("postComments", postComments);
        console.log("data", data);
        if (res.ok) {
          setPostComments(data?.comments);
          console.log("userPosts23", postComments);
          if (data?.comments?.length < 9) {
            setShowMore(false);
            setShowLess(false);
          } else {
            setShowMore(true);
            setShowLess(false);
          }
        }
      } catch (error) {
        console.log("error useEffect", error);
      }
    };
    if (currentUser.isAdmin) {
      fetchComments();
    }
  }, [currentUser._id]);
  const handleShowMore = async () => {
    const startIndex = postComments?.length;
    try {
      const res = await fetch(
        `/api/comment/getAllPostComments/?startIndex=${startIndex}`
      );
      const data = await res.json();
      if (res.ok) {
        setPostComments((prev) => [...prev, ...data?.comments]);
        if (data?.comments.length < 9) {
          setShowLess(true);
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log("handleShowMore", error);
    }
  };

  const handleShowLess = async () => {
    const startIndex = postComments?.length;
    try {
      const res = await fetch(`/api/comment/getAllPostComments`);
      const data = await res.json();
      if (res.ok) {
        setPostComments(data?.comments);
        if (data?.comments?.length < 9) {
          setShowMore(false);
          setShowLess(false);
        } else {
          setShowMore(true);
          setShowLess(false);
        }
      }
    } catch (error) {
      console.log("handleShowMore", error);
    }
  };

  const handleDeleteComment = async () => {
    setShowModal(false);
    try {
      const res = await fetch(
        `/api/comment/deleteComment/${commentIdToDelete}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
      }
      if (res.ok) {
        setPostComments((prev) =>
          prev.filter((comment) => comment._id !== commentIdToDelete)
        );

        handleShowLess();
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-300">
      {currentUser?.isAdmin && postComments?.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date Updated</Table.HeadCell>
              <Table.HeadCell>Comment Content</Table.HeadCell>
              <Table.HeadCell>Number Of Likes</Table.HeadCell>
              <Table.HeadCell>Number Of Loves</Table.HeadCell>
              <Table.HeadCell>Number Of Dislikes</Table.HeadCell>
              <Table.HeadCell>PostId</Table.HeadCell>
              <Table.HeadCell>userId</Table.HeadCell>
              <Table.HeadCell>Detete</Table.HeadCell>
            </Table.Head>

            {postComments.map((comment) => {
              return (
                <Table.Body className="divide-y" key={comment._id}>
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell>
                      {new Date(comment.updatedAt).toLocaleDateString()}
                    </Table.Cell>
                    <Table.Cell>{comment.content}</Table.Cell>
                    <Table.Cell>{comment.numberOfLikes}</Table.Cell>
                    <Table.Cell>{comment.numberOfLoves}</Table.Cell>
                    <Table.Cell>{comment.numberOfDisLikes}</Table.Cell>
                    <Table.Cell>{comment.postId}</Table.Cell>
                    <Table.Cell>{comment.userId}</Table.Cell>
                    <Table.Cell>
                      <span
                        onClick={() => {
                          setShowModal(true);
                          setCommentIdToDelete(comment._id);
                        }}
                        className="text-red-500 font-medium hover:underline cursor-pointer"
                      >
                        Delete
                      </span>
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              );
            })}
          </Table>
          {showMore && (
            <button
              onClick={handleShowMore}
              className="w-full text-teal-500 self-center text-sm py-7"
            >
              Show More
            </button>
          )}
          {showLess && (
            <button
              onClick={handleShowLess}
              className="w-full text-teal-500 self-center text-sm py-7"
            >
              Show Less
            </button>
          )}
        </>
      ) : (
        <p>You have no comments yet!</p>
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
              Are you sure you want to delete the Comment?
            </h3>
          </div>
          <div className="flex justify-center gap-16">
            <Button color="failure" onClick={handleDeleteComment}>
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

export default DashComments;
