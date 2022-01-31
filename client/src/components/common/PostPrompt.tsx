import React from "react";
import testImage from "../../images/test_profile_image.jpeg";
import { MdPhotoLibrary } from "react-icons/md";

const PostPrompt = () => {
  return (
    <section className="bg-zinc-100 shadow-md overflow-auto md:rounded-lg">
      <div className="flex items-center m-3 mb-0 pb-2 border-b border-b-zinc-300">
        <img
          src={testImage}
          alt="profile"
          className="rounded-full h-10 aspect-square inline-block mr-2"
        />
        <form className="inline-block w-full">
          <input
            type="text"
            placeholder="What's on your mind, Jason?"
            className="w-full p-2 pl-4 rounded-full bg-zinc-200 font-roboto"
          />
        </form>
      </div>
      <div className="grid place-items-center">
        <button className="flex items-center justify-center p-3 w-full rounded-full">
          <MdPhotoLibrary color="#10b981" size="2rem" />
          <span className=" font-roboto font-medium text-zinc-600 pl-3">
            Publish a photo
          </span>
        </button>
      </div>
    </section>
  );
};

export default PostPrompt;
