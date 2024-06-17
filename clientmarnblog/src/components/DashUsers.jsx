import { Table, Modal, Button } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { FaCheck, FaTimes } from "react-icons/fa";
const DashUsers = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [userPofiles, setUserPofiles] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [showLess, setShowLess] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [userIdToDelete, setPostIdToDelete] = useState("");
  console.log("userPofiles", userPofiles);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`/api/user/getUsers`);
        const data = await res.json();
        console.log("userPofiles", userPofiles);
        console.log("data", data);
        if (res.ok) {
          setUserPofiles(data?.users);
          console.log("userPosts23", userPofiles);
          if (data?.users?.length < 9) {
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
      fetchUsers();
    }
  }, [currentUser._id]);
  const handleShowMore = async () => {
    const startIndex = userPofiles?.length;
    try {
      const res = await fetch(`/api/user/getUsers/?startIndex=${startIndex}`);
      const data = await res.json();
      if (res.ok) {
        setUserPofiles((prev) => [...prev, ...data?.users]);
        if (data.users.length < 9) {
          setShowLess(true);
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log("handleShowMore", error);
    }
  };

  const handleShowLess = async () => {
    const startIndex = userPofiles?.length;
    try {
      const res = await fetch(`/api/user/getUsers`);
      const data = await res.json();
      if (res.ok) {
        setUserPofiles(data?.users);
        if (data?.users?.length < 9) {
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

  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      const res = await fetch(`/api/user/delete/${userIdToDelete}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
      }
      if (res.ok) {
        setUserPofiles((prev) =>
          prev.filter((user) => user._id !== userIdToDelete)
        );

        handleShowLess();
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-300">
      {currentUser?.isAdmin && userPofiles?.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date Created</Table.HeadCell>
              <Table.HeadCell>User Image</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>Admin</Table.HeadCell>
              <Table.HeadCell>Detete</Table.HeadCell>
            </Table.Head>

            {userPofiles.map((user) => {
              return (
                <Table.Body className="divide-y" key={user._id}>
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell>
                      {new Date(user?.createdAt).toLocaleDateString()}
                    </Table.Cell>
                    <Table.Cell>
                      <img
                        src={user?.profilePicture}
                        alt={user?.username}
                        className="w-20 h-20 object-cover bg-gray-500 rounded-full"
                      />
                    </Table.Cell>
                    <Table.Cell>{user?.username}</Table.Cell>
                    <Table.Cell>{user?.email}</Table.Cell>
                    <Table.Cell>
                      {user.isAdmin ? (
                        <FaCheck className="text-green-500" />
                      ) : (
                        <FaTimes className="text-red-500" />
                      )}
                    </Table.Cell>
                    <Table.Cell>
                      <span
                        onClick={() => {
                          setShowModal(true);
                          setPostIdToDelete(user._id);
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
        <p>You have no users yet!</p>
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
            <Button color="failure" onClick={handleDeleteUser}>
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

export default DashUsers;
