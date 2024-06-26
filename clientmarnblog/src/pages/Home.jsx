import React, { useEffect, useState } from "react";
import CallToAction from "../components/CallToAction";
import { Link } from "react-router-dom";
import PostCard from "../components/PostCard";

const Home = () => {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    //fetchPosts
    const fetchPosts = async () => {
      try {
        const res = await fetch(`/api/post/getPosts`);
        const data = await res.json();
        console.log("userPostsdata", data);
        if (res.ok) {
          setPosts(data.posts);
        }
      } catch (error) {
        console.log("userPostserror useEffect", error);
      }
    };
    fetchPosts();
  }, []);
  return (
    <div className="min-h-screen">
      <div className="flex flex-col gap-6 p-3 max-w-6xl mx-auto lg:p-28">
        <h1 className="text-3xl font-bold lg:text-lg">Welcome to my Blog</h1>
        <p className="text-gray-500 text-xs sm:text-sm">
          Here you'll find a variety of articles and tutorial on topics such as
          web development,software engineering, and programming languagues.
        </p>
        <Link
          to="/search"
          className="text-xs sm:text-sm text-teal-500 font-bold hover:underline"
        >
          View All Posts
        </Link>
      </div>
      <div className="p-3 bg-amber-400 dark:bg-gray-700">
        <CallToAction />
      </div>
      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7">
        {posts && posts?.length > 0 && (
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-semibold text-center">Recent Posts</h2>
            <div className="flex flex-wrap gap-4">
              {posts.map((post) => {
                return <PostCard key={post?._id} post={post} />;
              })}
            </div>
          </div>
        )}
        <Link
          to={"/search"}
          className="text-lg text-teal-500 hover:underline text-center"
        >
          View All Posts
        </Link>
      </div>
    </div>
  );
};

export default Home;
