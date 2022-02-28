import React from "react";

const SkeletonPost = () => {
  return (
    <article className="bg-zinc-100 shadow-md overflow-auto md:rounded-lg my-3">
      <section className="p-3 animate-pulse">
        <div className="flex items-center mb-2">
          <div className="rounded-full h-12 aspect-square inline-block mr-2 bg-zinc-300" />
          <div className="bg-zinc-300 h-6 w-32 rounded-md"></div>
        </div>
        <div className=" flex flex-col space-y-2">
          <div className="bg-zinc-300 h-6 w-full rounded-md"></div>
          <div className="bg-zinc-300 h-6 w-full rounded-md"></div>
          <div className="bg-zinc-300 h-6 w-full rounded-md"></div>
        </div>
      </section>
    </article>
  );
};

export default SkeletonPost;
