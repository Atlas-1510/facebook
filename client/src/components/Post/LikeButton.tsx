import { FC } from "react";
import { PostInterface } from "../../types/PostInterface";
import { User } from "../../types/User";
import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { FaRegThumbsUp } from "react-icons/fa";

type Props = {
  post: PostInterface;
  user: User;
  initialData: PostInterface;
};

const LikeButton: FC<Props> = ({ post, user, initialData }) => {
  const queryClient = useQueryClient();

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
  if (post.likes.includes(user!._id)) {
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
};

export default LikeButton;
