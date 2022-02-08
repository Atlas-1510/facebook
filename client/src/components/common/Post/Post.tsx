import { FC, SyntheticEvent, ReactNode } from "react";
import testPageImage from "../../../images/test_page.jpeg";
import { HiThumbUp } from "react-icons/hi";
import { FaRegThumbsUp, FaRegComment } from "react-icons/fa";
// import Comment from "../Comment";
import UserThumbnail from "../UserThumbnail";
import { PostInterface } from "../../../types/PostInterface";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "react-query";
import SkeletonPost from "./SkeletonPost";

// Need to set up a query for the post, using initial data passed by poststream.
// Upon like, needs to mutate. I should supply like status with an optimistic update.

type Props = {
  initialData: PostInterface;
};

const Post: FC<Props> = ({ initialData }) => {
  const queryClient = useQueryClient();

  const getAuthorProfile = async () => {
    try {
      const { data } = await axios.get(`/api/users/${initialData.author}`);
      return data;
    } catch (err) {
      console.log(err);
    }
  };

  const { data: author, status: authorStatus } = useQuery(
    `postAuthor: ${initialData._id}`,
    getAuthorProfile,
    {
      enabled: !!initialData?._id,
    }
  );

  const getPost = async () => {
    try {
      const { data } = await axios.get(`/api/posts/${initialData._id}`);
      return data;
    } catch (err) {
      console.log(err);
    }
  };

  const { data: post, status } = useQuery(`post: ${initialData._id}`, getPost, {
    initialData: initialData,
  });

  const submitLike = async () => {
    try {
      const { data } = await axios.post(`/api/posts/${initialData._id}/likes`);
      return data;
    } catch (err) {
      console.log(err);
    }
  };

  const removeLike = async () => {
    try {
      const { data } = await axios.delete(
        `/api/posts/${initialData._id}/likes`
      );
      console.log(data);
      return data;
    } catch (err) {
      console.log(err);
    }
  };

  const likeMutation = useMutation(submitLike, {
    onSuccess: () => queryClient.invalidateQueries(`post: ${initialData._id}`),
  });

  const removeLikeMutation = useMutation(removeLike, {
    onSuccess: () => queryClient.invalidateQueries(`post: ${initialData._id}`),
  });

  const handleLike = (e: SyntheticEvent) => {
    e.preventDefault();
    likeMutation.mutate();
  };

  const handleRemoveLike = (e: SyntheticEvent) => {
    e.preventDefault();
    removeLikeMutation.mutate();
  };

  const LikeButton: ReactNode = (() => {
    if (post.likes.includes(post.author)) {
      return (
        <button
          onClick={handleRemoveLike}
          className="flex items-center justify-center w-full my-1 rounded-full bg-blue-200 hover:bg-blue-300"
        >
          <FaRegThumbsUp className="text-facebook-blue text-xl" />
          <span className=" font-roboto font-medium text-facebook-blue pl-3">
            Liked!
          </span>
        </button>
      );
    } else {
      return (
        <button
          onClick={handleLike}
          className="flex items-center justify-center w-full my-1 rounded-full"
        >
          <FaRegThumbsUp className=" text-zinc-500 text-xl" />
          <span className=" font-roboto font-medium text-zinc-600 pl-3">
            Like
          </span>
        </button>
      );
    }
  })();

  if (status === "loading" || authorStatus === "loading") {
    return <SkeletonPost />;
  }
  if (status === "error") {
    return <div>Unable to get post information</div>;
  }
  if (authorStatus === "error") {
    return <div>Unable to get post author information</div>;
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
        <div className="m-1 h-12 flex border-b border-t border-zinc-300">
          {LikeButton}
          <button
            onClick={() => {
              document.getElementById(`commentInput-${post._id}`)?.focus();
            }}
            className="flex items-center justify-center w-full rounded-full"
          >
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
            id={`commentInput-${post._id}`}
          />
        </form>
      </article>
    );
  }
};

export default Post;
