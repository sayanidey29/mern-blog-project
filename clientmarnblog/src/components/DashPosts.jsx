import { Table, Modal, Button } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";
const DashPosts = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [showLess, setShowLess] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState("");
  console.log("userPosts", userPosts);
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`/api/post/getPosts?userId=${currentUser._id}`);
        const data = await res.json();
        console.log("userPosts", userPosts);
        console.log("data", data);
        if (res.ok) {
          setUserPosts(data?.posts);
          console.log("userPosts23", userPosts);
          if (data?.posts?.length < 9) {
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
      fetchPosts();
    }
  }, [currentUser._id]);
  const handleShowMore = async () => {
    const startIndex = userPosts?.length;
    try {
      const res = await fetch(
        `/api/post/getPosts/?userId=${currentUser._id}&startIndex=${startIndex}`
      );
      const data = await res.json();
      if (res.ok) {
        setUserPosts((prev) => [...prev, ...data?.posts]);
        if (data.posts.length < 9) {
          setShowLess(true);
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log("handleShowMore", error);
    }
  };

  const handleShowLess = async () => {
    const startIndex = userPosts?.length;
    try {
      const res = await fetch(`/api/post/getPosts/?userId=${currentUser._id}`);
      const data = await res.json();
      if (res.ok) {
        setUserPosts(data?.posts);
        if (data?.posts?.length < 9) {
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

  const handleDeletePost = async () => {
    setShowModal(false);
    try {
      const res = await fetch(
        `/api/post/deletePosts/${postIdToDelete}/${currentUser._id}`
      );
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
      }
      if (res.ok) {
        setUserPosts((prev) =>
          prev.filter((post) => post._id !== postIdToDelete)
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-300">
      {currentUser?.isAdmin && userPosts?.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date Updated</Table.HeadCell>
              <Table.HeadCell>Post Image</Table.HeadCell>
              <Table.HeadCell>Post Title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              <Table.HeadCell>Detete</Table.HeadCell>
              <Table.HeadCell>
                <span>Edit</span>
              </Table.HeadCell>
            </Table.Head>

            {userPosts.map((post) => {
              return (
                <Table.Body className="divide-y">
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell>
                      {new Date(post.updatedAt).toLocaleDateString()}
                    </Table.Cell>
                    <Table.Cell>
                      <Link to={`/post/${post.slug}`}>
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-20 h-20 object-cover bg-gray-500"
                        />
                      </Link>
                    </Table.Cell>
                    <Table.Cell>
                      <Link
                        to={`/post/${post.slug}`}
                        className="font-medium  text-gray-900 dark:text-white"
                      >
                        {post.title.toUpperCase()}
                      </Link>
                    </Table.Cell>
                    <Table.Cell>{post.category}</Table.Cell>
                    <Table.Cell>
                      <span
                        onClick={() => {
                          setShowModal(true);
                          setPostIdToDelete(post._id);
                        }}
                        className="text-red-500 font-medium hover:underline cursor-pointer"
                      >
                        Delete
                      </span>
                    </Table.Cell>
                    <Table.Cell>
                      <Link
                        to={`/update-post/${post._id}`}
                        className="text-teal-500 hover:underline"
                      >
                        <span>Edit</span>
                      </Link>
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
        <p>You have no posts yet!</p>
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
              Are you sure you want to delete your account?
            </h3>
          </div>
          <div className="flex justify-center gap-16">
            <Button color="failure" onClick={handleDeletePost}>
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

export default DashPosts;
