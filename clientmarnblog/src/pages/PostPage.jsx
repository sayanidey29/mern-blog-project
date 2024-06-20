import { useParams, Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Spinner } from "flowbite-react";
import CallToAction from "../components/CallToAction";
import CommentSection from "../components/CommentSection";
import PostCard from "../components/PostCard";

const PostPage = () => {
  const { postSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [postData, setPostData] = useState(null);
  const [recentPosts, setRecentPosts] = useState(null);
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/post/getPosts/?slug=${postSlug}`);
        console.log("res ", res);
        const data = await res?.data;
        setLoading(false);
        console.log(
          "res data",
          data,
          data?.posts?.[0]?.createdAt,
          new Date(data?.posts?.[0]?.createdAt),
          new Date(data?.posts?.[0]?.createdAt).toLocaleDateString()
        );
        if (data?.success === false) {
          console.log("Error", data?.message);
          return setError(true);
        }
        if (res?.statusText?.toLowerCase() === "ok") {
          setPostData(data?.posts?.[0]);
          setError(false);
        }
      } catch (error) {
        setLoading(false);
        setPostData(null);
        console.log("Error", error, error?.message);
        return setError(true);
      }
    };
    fetchPost();
    console.log(postSlug);
  }, [postSlug]);

  useEffect(() => {
    try {
      const fetchRecentPosts = async () => {
        const res = await axios.get(`/api/post/getPosts?limit=3`);
        const data = await res.data;
        if (data?.success === false) {
          console.log(error);
          return;
        }
        if (res?.statusText?.toLowerCase() === "ok") {
          setRecentPosts(data.posts);
        }
      };
      fetchRecentPosts();
    } catch (error) {
      console.log(error);
      return;
    }
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex gap-1 justify-center my-5">
        <Spinner color="gray"></Spinner>{" "}
        <span className="text-gray-500">Loading...</span>
      </div>
    );
  return (
    <main className="min-h-screen p-3 flex flex-col max-w-6xl mx-auto ">
      <h1 className="'text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl">
        {postData && postData.title}
      </h1>
      <Link
        to={`/search?category=${postData && postData.category}`}
        className="self-center mt-5"
      >
        {/* added a query*/}
        <Button color="gray" pill size="xs">
          {postData && postData.category}
        </Button>
      </Link>
      <img
        src={postData && postData.image}
        alt={postData && postData.title}
        className="mt-10 p-3 object-cover max-h-[600px] w-[80%] mx-auto"
      ></img>
      <div className="flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs">
        <span>
          {postData && new Date(postData.createdAt).toLocaleDateString()}
        </span>
        <span className="italic">
          {postData && (postData.content.length / 1000).toFixed(0)} mins read
        </span>
      </div>
      <div
        className="P-3 max-w-2xl mx-auto w-full post-content mt-5"
        dangerouslySetInnerHTML={{ __html: postData && postData.content }}
      ></div>

      {/*CallToAction component*/}
      <div className="max-w-4xl mx-auto w-full">
        <CallToAction />
      </div>

      {/*Comment Section component*/}
      <CommentSection postId={postData?._id} />

      {/*Recent Artical*/}
      <div className="flex flex-col justify-center items-center mb-5">
        <h1 className="text-xl mt-5">Recent Articals</h1>
        <div className=" flex flex-wrap gap-5 mt-5 justify-center ">
          {recentPosts &&
            recentPosts.map((post) => {
              return <PostCard key={post?._id} post={post} />;
            })}
        </div>
      </div>
    </main>
  );
};

export default PostPage;
