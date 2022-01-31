import React from "react";
import Post from "../../components/common/Post";
import PostPrompt from "../../components/common/PostPrompt";

const Mobile = () => {
  return (
    <main className="flex flex-col">
      <PostPrompt />
      <Post />
      <Post />
      <Post />
      <Post />
    </main>
  );
};

export default Mobile;
