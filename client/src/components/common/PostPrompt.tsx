import { useState, useContext, SyntheticEvent } from "react";
import { MdPhotoLibrary } from "react-icons/md";
import UserThumbnail from "./UserThumbnail";
import Modal from "../Modal";
import PrimaryButton from "../PrimaryButton";
import { AuthContext } from "../../contexts/Auth";
import axios from "axios";
import WhiteBox from "./WhiteBox";
import { useMutation, useQueryClient } from "react-query";

const PostPrompt = () => {
  const { user } = useContext(AuthContext);
  const [modalOpen, setModalOpen] = useState(false);
  const [postInput, setPostInput] = useState("");
  const [flash, setFlash] = useState("");
  const queryClient = useQueryClient();

  const publishPost = async () => {
    try {
      const { data } = await axios.post("/api/posts", {
        author: user?._id,
        content: postInput,
      });
      return data;
    } catch (err) {
      console.error(err);
    }
  };

  const mutation = useMutation(publishPost, {
    onSuccess: () => {
      queryClient.invalidateQueries("profile posts");
      queryClient.invalidateQueries("newsfeed");

      setPostInput("");
      setModalOpen(false);
    },
    onError: () => {
      setFlash("Something went wrong");
    },
  });

  const handlePostSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setFlash("");
    mutation.mutate();
  };

  return (
    <WhiteBox>
      <div className="flex items-center mb-0 pb-2 border-b border-b-zinc-300 h-12">
        <UserThumbnail />
        <button
          onClick={() => setModalOpen(true)}
          className="w-full ml-2 p-2 pl-4 rounded-full bg-zinc-200 font-roboto flex items-center justify-start text-zinc-500"
        >
          What's on your mind, Jason?
        </button>
      </div>
      <div className="grid place-items-center">
        <button className="flex items-center justify-center pt-3 w-full rounded-full">
          <MdPhotoLibrary color="#10b981" size="2rem" />
          <span className=" font-roboto font-medium text-zinc-600 pl-3">
            Publish a photo
          </span>
        </button>
      </div>
      <Modal
        open={modalOpen}
        title="Create Post"
        onClose={() => setModalOpen(false)}
      >
        <div className="flex flex-col w-full">
          <div className="h-10 flex items-center">
            <UserThumbnail />
            <span className=" font-roboto font-medium text-zinc-900 ml-2">
              {user?.firstName}
            </span>
          </div>

          <form
            className="flex flex-col item-center w-full"
            onSubmit={handlePostSubmit}
          >
            <textarea
              className="my-3 w-full h-40 placeholder:font-roboto placeholder:text-zinc-600 placeholder:text-xl focus:placeholder:text-zinc-400 resize-none outline-none"
              placeholder={`What's on your mind, ${user?.firstName}?`}
              aria-label="post input"
              name="post"
              required
              autoFocus
              value={postInput}
              onChange={(e) => setPostInput(e.target.value)}
            />

            <span className="my-2 text-red-500 text-sm">{flash}</span>
            <PrimaryButton
              title="Post"
              onClick={async () => {}}
              type="submit"
              disabled={postInput === ""}
            />
          </form>
        </div>
      </Modal>
    </WhiteBox>
  );
};

export default PostPrompt;
