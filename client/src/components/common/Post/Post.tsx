import { FC, ReactNode, useState } from "react";
import testPageImage from "../../../images/test_page.jpeg";
import { HiThumbUp } from "react-icons/hi";
import { FaRegThumbsUp, FaRegComment } from "react-icons/fa";
import Comment from "../Comment";
import UserThumbnail from "../UserThumbnail";
import { PostInterface } from "../../../types/PostInterface";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "react-query";
import SkeletonPost from "./SkeletonPost";
import { CommentInterface } from "../../../types/CommentInterface";
import getReadableTimestamp from "../../../utils/getReadableTimestamp";

type Props = {
  initialData: PostInterface;
};

const Post: FC<Props> = ({ initialData }) => {
  const queryClient = useQueryClient();

  const { data: author, status: authorStatus } = useQuery(
    `postAuthor: ${initialData._id}`,
    async () => {
      try {
        const { data } = await axios.get(`/api/users/${initialData.author}`);
        return data;
      } catch (err) {
        console.log(err);
      }
    },
    {
      enabled: !!initialData?._id,
    }
  );

  const { data: post, status } = useQuery(
    `post: ${initialData._id}`,
    async () => {
      try {
        const { data } = await axios.get(`/api/posts/${initialData._id}`);
        return data;
      } catch (err) {
        console.log(err);
      }
    },
    {
      initialData: initialData,
    }
  );

  // LIKES

  const likeMutation = useMutation(
    async () => {
      try {
        const { data } = await axios.post(
          `/api/posts/${initialData._id}/likes`
        );
        return data;
      } catch (err) {
        console.log(err);
      }
    },
    {
      onSuccess: () =>
        queryClient.invalidateQueries(`post: ${initialData._id}`),
    }
  );

  const removeLikeMutation = useMutation(
    async () => {
      try {
        const { data } = await axios.delete(
          `/api/posts/${initialData._id}/likes`
        );
        return data;
      } catch (err) {
        console.log(err);
      }
    },
    {
      onSuccess: () =>
        queryClient.invalidateQueries(`post: ${initialData._id}`),
    }
  );

  const LikeButton: ReactNode = (() => {
    if (post.likes.includes(post.author)) {
      return (
        <button
          onClick={(e) => {
            e.preventDefault();
            removeLikeMutation.mutate();
          }}
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
          onClick={(e) => {
            e.preventDefault();
            likeMutation.mutate();
          }}
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

  // COMMENTS

  const [commentInput, setCommentInput] = useState("");
  const commentMutation = useMutation(
    async () => {
      try {
        const { data } = await axios.post(
          `/api/posts/${initialData._id}/comments`,
          {
            content: commentInput,
          }
        );
        return data;
      } catch (err) {
        console.log(err);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(`post: ${initialData._id}`);
        setCommentInput("");
      },
    }
  );

  const handleCommentButtonClick = () => {
    const input = document.getElementById(`commentInput-${post._id}`);
    input?.focus();
    input?.scrollIntoView({
      block: "center",
    });
  };

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
              <span className=" text-sm text-zinc-600">
                {getReadableTimestamp(post.createdAt)}
              </span>
            </div>
          </div>
          <p>{post.content}</p>
        </section>
        {/* <img src={testPostImage} alt="test post" /> */}
        <div className=" flex justify-between m-3 mb-0 pb-2 text-zinc-500 ">
          <div className="flex items-center">
            <HiThumbUp className=" -translate-y-[2px] text-facebook-blue text-xl" />
            <span className="ml-2">{post.likes.length}</span>
          </div>
          {post.comments.length === 1 && <span>1 comment</span>}
          {post.comments.length > 1 && (
            <span>{post.comments.length} comments</span>
          )}
        </div>
        <div className="m-1 h-12 flex border-b border-t border-zinc-300">
          {LikeButton}
          <button
            onClick={handleCommentButtonClick}
            className="flex items-center justify-center w-full rounded-full"
          >
            <FaRegComment className=" text-zinc-500 text-xl" />
            <span className=" text-base font-roboto font-medium text-zinc-600 pl-3">
              Comment
            </span>
          </button>
        </div>
        <section className="p-3 space-y-3">
          {post.comments.map((comment: CommentInterface) => (
            <Comment key={comment._id} comment={comment} />
          ))}
        </section>
        <form className="p-3 pt-3 flex">
          <div className="h-10">
            <UserThumbnail />
          </div>

          <input
            type="text"
            placeholder="Write a comment..."
            className="w-full ml-2 p-2 pl-4 rounded-full bg-zinc-200 font-roboto"
            value={commentInput}
            id={`commentInput-${post._id}`}
            onChange={(e) => {
              setCommentInput(e.target.value);
            }}
            onKeyPress={(e) => {
              if (e.code === "Enter" || e.code === "NumpadEnter") {
                e.preventDefault();
                commentMutation.mutate();
              }
            }}
          />
        </form>
      </article>
    );
  }
};

export default Post;
