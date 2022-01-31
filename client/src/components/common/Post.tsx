import React from "react";
import testPageImage from "../../images/test_page.jpeg";
import testPostImage from "../../images/test_post_image.jpeg";
import { HiThumbUp } from "react-icons/hi";
import { FaRegThumbsUp, FaRegComment } from "react-icons/fa";

const Post = () => {
  return (
    <article className="bg-zinc-100 shadow-md overflow-auto md:rounded-lg my-3">
      <div className="p-3">
        <div className="flex items-center mb-2">
          <img
            src={testPageImage}
            alt="profile"
            className="rounded-full h-10 aspect-square inline-block mr-2"
          />
          <div className="flex flex-col">
            <h2 className="font-medium">Bloomberg</h2>
            <span className=" text-sm text-zinc-600">14h</span>
          </div>
        </div>
        <p>
          Rafael Nadal overcame Russia's Daniil Medvedev in a grueling five-hour
          final to win the Australian Open, becoming the first man to claim 21
          Grand Slam titles.
        </p>
      </div>
      <img src={testPostImage} alt="test post" />
      <div className=" flex justify-between m-3 mb-0 pb-2 text-zinc-500 border-b border-zinc-300">
        <div className="flex items-center">
          <HiThumbUp className=" -translate-y-[2px] text-facebook-blue text-xl" />
          <span className="ml-2">8.8k</span>
        </div>
        <span> 625 comments</span>
      </div>
      <div className="p-3 flex">
        <button className="flex items-center justify-center w-full rounded-full">
          <FaRegThumbsUp className=" text-zinc-500 text-xl" />
          <span className=" font-roboto font-medium text-zinc-600 pl-3">
            Like
          </span>
        </button>
        <button className="flex items-center justify-center w-full rounded-full">
          <FaRegComment className=" text-zinc-500 text-xl" />
          <span className=" text-base font-roboto font-medium text-zinc-600 pl-3">
            Comment
          </span>
        </button>
      </div>
    </article>
  );
};

export default Post;
