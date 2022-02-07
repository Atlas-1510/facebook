import { FC } from "react";
import testPageImage from "../../../images/test_page.jpeg";
import testPostImage from "../../images/test_post_image.jpeg";
import { HiThumbUp } from "react-icons/hi";
import { FaRegThumbsUp, FaRegComment } from "react-icons/fa";
import Comment from "../Comment";
import UserThumbnail from "../UserThumbnail";
import { PostInterface } from "../../../types/PostInterface";
import axios from "axios";
import { useQuery } from "react-query";
import SkeletonPost from "./SkeletonPost";

type Props = {
  post: PostInterface;
};

const Post: FC<Props> = ({ post }) => {
  const getAuthorProfile = async () => {
    try {
      const { data } = await axios.get(`/api/users/${post.author}`);
      return data;
    } catch (err) {
      console.log(err);
    }
  };

  const { data: author, status } = useQuery(
    `postAuthor: ${post._id}`,
    getAuthorProfile,
    {
      enabled: !!post?._id,
    }
  );

  if (status === "loading") {
    return <SkeletonPost />;
  }
  if (status === "error") {
    return <div>Unable to get post author</div>;
  } else {
    return (
      <article className="bg-zinc-100 shadow-md overflow-auto md:rounded-lg my-3">
        <section className="p-3">
          <div className="flex items-center mb-2">
            <img
              src={testPageImage}
              alt="profile"
              className="rounded-full h-12 aspect-square inline-block mr-2"
            />
            <div className="flex flex-col">
              <h2 className="font-medium">{author.fullName}</h2>
              <span className=" text-sm text-zinc-600">14h</span>
            </div>
          </div>
          <p>{post.content}</p>
        </section>
        {/* <img src={testPostImage} alt="test post" /> */}
        <div className=" flex justify-between m-3 mb-0 pb-2 text-zinc-500 ">
          <div className="flex items-center">
            <HiThumbUp className=" -translate-y-[2px] text-facebook-blue text-xl" />
            <span className="ml-2">8.8k</span>
          </div>
          <span> 625 comments</span>
        </div>
        <div className="m-1 py-3 flex border-b border-t border-zinc-300">
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
        <section className="p-3 space-y-3">{/* <Comment /> */}</section>
        <form className="p-3 pt-3 flex">
          <div className="h-10">
            <UserThumbnail />
          </div>

          <input
            type="text"
            placeholder="Write a comment..."
            className="w-full ml-2 p-2 pl-4 rounded-full bg-zinc-200 font-roboto"
          />
        </form>
      </article>
    );
  }
};

export default Post;
