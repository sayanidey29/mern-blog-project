import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashSidebar from "../components/DashSidebar";
import DashProfile from "../components/DashProfile";
import DashPosts from "../components/DashPosts";
import { useSelector } from "react-redux";

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
      {/*Profile...*/}
      <div className="flex-1">{tab === "profile" && <DashProfile />}</div>
      {/*Post...*/}
      <div className="flex-1">
        {tab === "posts" && currentUser?.isAdmin && <DashPosts />}
      </div>
    </div>
  );
};

export default Dashboard;
