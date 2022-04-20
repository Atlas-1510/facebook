import { FC, useContext, useState } from "react";
import { HiThumbUp } from "react-icons/hi";
import { FaRegComment } from "react-icons/fa";
import { BsThreeDots } from "react-icons/bs";
import Comment from "../Comment";
import UserThumbnail from "../common/UserThumbnail";
import { PostInterface } from "../../types/PostInterface";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "react-query";
import SkeletonPost from "./SkeletonPost";
import { CommentInterface } from "../../types/CommentInterface";
import getReadableTimestamp from "../../utils/getReadableTimestamp";
import { AuthContext } from "../../contexts/Auth";
import { Link } from "react-router-dom";
import LikeButton from "./LikeButton";
import PostImage from "./PostImage";
import Modal from "../Modal";
import useComponentVisible from "../../hooks/useComponentVisible";
import EditPostForm from "./EditPostForm";

type Props = {
  initialData: PostInterface;
};

const Post: FC<Props> = ({ initialData }) => {
  const { user } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const [editPostModal, setEditPostModal] = useState(false);

  // Get post author name, profile image
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

  async function fetchPost(): Promise<PostInterface | undefined> {
    try {
      const { data } = await axios.get(`/api/posts/${initialData._id}`);
      return data;
    } catch (err) {
      console.log(err);
      return undefined;
    }
  }

  // get post information if it's edited by user later
  const { data: post, status } = useQuery(
    `post: ${initialData._id}`,
    fetchPost,
    {
      initialData: initialData,
    }
  );

  // Get post comments
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
    const input = document.getElementById(`commentInput-${initialData._id}`);
    input?.focus();
    input?.scrollIntoView({
      block: "center",
    });
  };

  // EDIT/DELETE MENU

  // Hook controls whether menu is visible
  const { ref, isComponentVisible, setIsComponentVisible } =
    useComponentVisible(false);

  const deletePost = async () => {
    await axios.delete(`api/posts/${post?._id}`);
    queryClient.invalidateQueries("newsfeed");
    queryClient.invalidateQueries(`profile posts ${user?._id}`);
    queryClient.invalidateQueries(`imagePosts ${user!._id}`);
  };

  // IMAGE

  // Image ID is stored on post object. Actual image file needs to be retrieved
  // from API using the ID.
  const fetchImage = async () => {
    try {
      const result = await axios.get(`/api/images/${post?.image}`, {
        responseType: "blob",
      });

      return URL.createObjectURL(result.data);
    } catch (err) {
      throw new Error("Fetch error");
    }
  };

  const {
    isLoading: isImageLoading,
    isError: isImageError,
    isSuccess: isImageSuccess,
    data: imageData,
  } = useQuery(`postID: ${post?._id} - postImage: ${post?.image}`, fetchImage, {
    enabled: !!post?.image,
  });

  if (!user) {
    return null;
  }

  if (status === "loading" || authorStatus === "loading") {
    return <SkeletonPost />;
  }
  if (status === "error") {
    return <div>Unable to get post information</div>;
  }
  if (authorStatus === "error") {
    return <div>Unable to get post author information</div>;
  }
  if (post) {
    return (
      <article className="bg-zinc-100 shadow-md overflow-auto md:rounded-lg my-3">
        <section className="p-3">
          <div className="flex justify-between items-start">
            <Link to={`/users/${author._id}`}>
              <div className="flex items-center mb-2">
                <div className="aspect-square  h-12  mr-2 ">
                  <UserThumbnail id={author._id} />
                </div>

                <div className="flex flex-col">
                  <h2 className="font-medium">{author.fullName}</h2>
                  <span className=" text-sm text-zinc-600">
                    {getReadableTimestamp(post.createdAt)}
                  </span>
                </div>
              </div>
            </Link>

            {initialData.author === user._id ? (
              <div ref={ref} className="relative">
                <button
                  onClick={() => setIsComponentVisible(true)}
                  className="m-0 p-0"
                >
                  <BsThreeDots className=" text-2xl" />
                </button>
                {isComponentVisible ? (
                  <menu className=" absolute right-3 top-3 bg-white py-1 px-5 rounded-md shadow-md flex flex-col items-center justify-center whitespace-nowrap">
                    <li className=" border-b p-2">
                      <button
                        onClick={() => {
                          setEditPostModal(true);
                          setIsComponentVisible(false);
                        }}
                      >
                        Edit Post
                      </button>
                    </li>
                    <li className=" text-red-500 p-2">
                      <button onClick={deletePost}>Delete Post</button>
                    </li>
                  </menu>
                ) : null}
              </div>
            ) : null}
          </div>

          <p>{post.content}</p>
        </section>
        {post.image ? (
          <PostImage
            loading={isImageLoading}
            error={isImageError}
            data={imageData}
            success={isImageSuccess}
          />
        ) : null}
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
          <LikeButton initialData={initialData} user={user} post={post} />
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
            <UserThumbnail id={user._id} />
          </div>

          <input
            aria-label="Add Comment"
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
        {editPostModal ? (
          <Modal
            open={editPostModal}
            onClose={() => setEditPostModal(false)}
            title="Edit Post"
          >
            <EditPostForm post={post} onClose={() => setEditPostModal(false)} />
          </Modal>
        ) : null}
      </article>
    );
  } else {
    return null;
  }
};

export default Post;
