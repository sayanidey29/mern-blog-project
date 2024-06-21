import { Button, Select, Spinner, TextInput } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import PostCard from "../components/PostCard";
const SearchPage = () => {
  const location = useLocation();
  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    sort: "desc",
    category: "uncategorized",
  });
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showMore, setShowMore] = useState(null);
  console.log("sidebarData", sidebarData);
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermsFormUrl = urlParams.get("searchTerm");
    const sortFormUrl = urlParams.get("sort");
    const categoryFormUrl = urlParams.get("category");
    if (searchTermsFormUrl) {
      setSidebarData({
        ...sidebarData,
        searchTerm: searchTermsFormUrl,
        sort: sortFormUrl,
        category: categoryFormUrl,
      });
    }
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const searchQuery = urlParams.toString();
        console.log("searchQuery", searchQuery);
        const res = await axios.get(`/api/post/getPosts/?${searchQuery}`);
        console.log("res ", res);
        const data = await res?.data;
        setLoading(false);
        console.log("res data", data);
        if (data?.success === false) {
          console.log("Error", data?.message);
          return setError(true);
        }
        if (res?.status === 200) {
          console.log("47...data.posts", data);
          setPosts(data.posts);
          setLoading(false);
          setError(null);
          if (data.posts.length === 9) {
            setShowMore(true);
          } else {
            setShowMore(false);
          }
        }
      } catch (error) {
        setLoading(false);
        console.log("Error", error, error?.message);
        return setError(error?.message);
      }
    };
    fetchPosts();
  }, [location.search]);
  const handleChange = (e) => {
    if (e.target?.id === "searchTerm") {
      setSidebarData({
        ...sidebarData,
        searchTerm: e.target.value,
      });
    }
    if (e.target?.id === "sort") {
      const order = e.target.value || "desc";
      setSidebarData({
        ...sidebarData,
        sort: order,
      });
    }
    if (e.target?.id === "category") {
      const category = e.target.value || "uncategorized";
      setSidebarData({
        ...sidebarData,
        category: category,
      });
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", sidebarData.searchTerm);
    urlParams.set("sort", sidebarData.sort);
    urlParams.set("category", sidebarData.category);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };
  const handleShowMore = async () => {
    const numberOfPosts = posts.length;
    const startIndex = numberOfPosts;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    // const searchQuery = urlParams.toString();
    // navigate(`/search?${searchQuery}`);
    try {
      const res = await fetch(`/api/post/getPosts/${searchQuery}`);
      const data = await res.json();
      if (res.ok) {
        setPosts([...posts, ...data.posts]);
        if (data?.posts.length === 9) {
          setShowMore(true);
        } else {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log("handleShowMore", error);
    }
  };
  return (
    <div className="flex flex-col md:flex-row">
      <div
        className="p-7  border-b md:border-r md:min-h-screen border-gray-500 "
        onSubmit={handleSubmit}
      >
        <form className="flex flex-col gap-8">
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">
              Search Term:
            </label>
            <TextInput
              placeholder="Search..."
              id="searchTerm"
              type="text"
              value={sidebarData.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">sort:</label>
            <Select id="sort" value={sidebarData.sort} onChange={handleChange}>
              <option value="desc">Latest</option>
              <option value="asc">Oldest</option>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">Category:</label>
            <Select
              id="category"
              value={sidebarData.category}
              onChange={handleChange}
            >
              <option value="uncategorized">Uncategorized</option>
              <option value="javascript">JavaScript</option>
              <option value="reactjs">React.js</option>
              <option value="nextjs">Next.js</option>
            </Select>
          </div>
          <Button type="submit" outline gradientDuoTone="purpleToPink">
            Apply Filters
          </Button>
        </form>
      </div>
      <div className="w-full">
        <h1 className="text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5">
          Posts Results:
        </h1>
        <div className="p-7 flex flex-wrap gap-4">
          {!loading && posts.length === 0 && (
            <p className="text-xl text-gray-500">No Posts Found!!!</p>
          )}
          {loading && (
            <div>
              <Spinner />
              <span className="text-xl text-gray-500">Loading...</span>
            </div>
          )}
          {!loading &&
            posts &&
            posts.map((post) => <PostCard key={post?._id} post={post} />)}
          {showMore && (
            <button
              onClick={handleShowMore}
              className="text-teal-500 text-lg hover:underline p-7 w-full"
            >
              Show More
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
