import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashSidebar from "../components/DashSidebar";
import DashProfile from "../components/DashProfile";
import DashPosts from "../components/DashPosts";
import DashUsers from "../components/DashUsers";
import { useSelector } from "react-redux";
import DashComments from "../components/DashComments";
import DashboardComponent from "../components/DashboardComponent";

const Dashboard = () => {
  const location = useLocation();
  const { currentUser } = useSelector((state) => state.user);
  console.log("location", location);
  const [tab, setTab] = useState("");
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    console.log("urlParams", urlParams);
    const tabFromUrl = urlParams.get("tab");
    console.log("tabFromUrl", tabFromUrl);
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="md:w-56">
        {/*Sidebar*/}
        <DashSidebar />
      </div>
      {/*Comments...*/}
      {tab === "dash" && (
        //currentUser?.isAdmin &&
        <DashboardComponent />
      )}
      {/*Profile...*/}
      {tab === "profile" && <DashProfile />}
      {/*Post...*/}
      {tab === "posts" && (
        //currentUser?.isAdmin &&
        <DashPosts />
      )}
      {/*Users...*/}
      {tab === "users" && (
        //currentUser?.isAdmin &&
        <DashUsers />
      )}
      {/*Comments...*/}
      {tab === "comments" && (
        //currentUser?.isAdmin &&
        <DashComments />
      )}
    </div>
  );
};

export default Dashboard;
