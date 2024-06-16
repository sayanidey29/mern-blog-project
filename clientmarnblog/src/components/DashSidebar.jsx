import React, { useEffect, useState } from "react";
import { Sidebar } from "flowbite-react";
import { HiUser, HiArrowSmRight } from "react-icons/hi";
import { useLocation, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  signoutStart,
  signoutSuccess,
  signoutFailure,
} from "../redux/user/userSlice";

const DashSidebar = () => {
  const location = useLocation();
  console.log("location", location);
  const dispatch = useDispatch();
  const [tab, setTab] = useState("");
  const [userSignoutError, setUserSignoutError] = useState(null);
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    console.log("urlParams", urlParams);
    const tabFromUrl = urlParams.get("tab");
    console.log("tabFromUrl", tabFromUrl);
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);
  const handleSignout = async () => {
    setUserSignoutError(null);
    try {
      dispatch(signoutStart());
      const res = await fetch("/api/user/signout", {
        method: "POST",
      });
      const data = res.json();
      if (data?.success === false) {
        dispatch(signoutFailure());
        return setUserSignoutError(data?.message);
      }
      if (res?.ok) {
        setUserSignoutError(null);
        dispatch(signoutSuccess());
      }
    } catch (error) {
      dispatch(signoutFailure());
      return setUserSignoutError(error?.message);
    }
  };
  return (
    <Sidebar className="w-full md:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Link to="/dashboard?tab=profile">
            <Sidebar.Item
              active={tab === "profile"}
              icon={HiUser}
              label={"User"}
              labelColor="dark"
              as="div"
            >
              Profile
            </Sidebar.Item>
          </Link>
          <Sidebar.Item
            icon={HiArrowSmRight}
            className="cursor-pointer"
            onClick={handleSignout}
          >
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
};

export default DashSidebar;
