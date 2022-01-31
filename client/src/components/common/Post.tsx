import { FC } from "react";
import testPageImage from "../../images/test_page.jpeg";
import testPostImage from "../../images/test_post_image.jpeg";
import { HiThumbUp } from "react-icons/hi";
import { FaRegThumbsUp, FaRegComment } from "react-icons/fa";
import Comment from "../common/Comment";

type Props = {
  author?: string;
  authorProfilePhoto?: string;
  content?: string;
  image?: string;
  likes?: any[];
  comments?: any[];
};

const Post: FC<Props> = ({
  author,
  authorProfilePhoto,
  content,
  image,
  likes,
  comments,
}) => {
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
            <h2 className="font-medium">Bloomberg</h2>
            <span className=" text-sm text-zinc-600">14h</span>
          </div>
        </div>
        <p>
          Rafael Nadal overcame Russia's Daniil Medvedev in a grueling five-hour
          final to win the Australian Open, becoming the first man to claim 21
          Grand Slam titles.
        </p>
      </section>
      <img src={testPostImage} alt="test post" />
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
      <section className="p-3 space-y-3">
        <Comment />
        <Comment />
      </section>
    </article>
  );
};

export default Post;
