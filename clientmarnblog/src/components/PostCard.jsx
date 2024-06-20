import React from "react";
import { Link } from "react-router-dom";

const PostCard = ({ post }) => {
  console.log(post, "gotpost");
  return (
    <div
      className="group relative w-full border hover:border-2 h-[400px] 
    overflow-hidden rounded-lg sm:w-[350px] border-teal-500 transition-all"
    >
      <Link to={`/post-page/${post?.slug}`}>
        <img
          src={post.image}
          alt={post.title}
          className="h-[260px] w-full object-cover group-hover:h-[200px] transition-all duration-300 z-20"
        />
      </Link>
      <div className="p-3 flex flex-col gap-2">
        <p className="text-lg font-semibold line-clamp-2">{post.title}</p>
        <span className="italic text-sm">{post?.category}</span>
      </div>
      <Link
        to={`/post-page/${post?.slug}`}
        className="z-10 group-hover:bottom-0 absolute bottom-[-200px]
         left-0 right-0 border border-teal-500 text-teal-500 hover:bg-teal-500
         hover:text-white text-center py-2 rounded-md !rounded-tl-none m-2 transition-all duration-300 "
      >
        Read Artical
      </Link>
    </div>
  );
};

export default PostCard;
