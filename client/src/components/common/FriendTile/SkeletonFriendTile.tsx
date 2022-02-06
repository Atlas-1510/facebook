import React from "react";

const SkeletonFriendTile = () => {
  return (
    <div className=" flex items-center justify-between border-zinc-300 border rounded-xl p-3 animate-pulse">
      <div className="flex items-center flex-grow">
        <div className="rounded-xl h-20 aspect-square bg-zinc-300" />
        <div className="flex flex-col font-medium ml-3 flex-grow w-full space-y-2">
          <span className=" w-36 h-4 bg-zinc-300 rounded-md"></span>
          <span className=" w-56 h-4 bg-zinc-300 rounded-md"></span>
          <div className="  w-20 h-4 bg-zinc-300 rounded-md"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonFriendTile;
