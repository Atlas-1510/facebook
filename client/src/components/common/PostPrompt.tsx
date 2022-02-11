import {
  useState,
  useContext,
  SyntheticEvent,
  useRef,
  useEffect,
  ReactNode,
} from "react";
import { MdPhotoLibrary } from "react-icons/md";
import UserThumbnail from "./UserThumbnail";
import Modal from "../Modal";
import PrimaryButton from "../PrimaryButton";
import { AuthContext } from "../../contexts/Auth";
import axios from "axios";
import WhiteBox from "./WhiteBox";
import { useMutation, useQueryClient } from "react-query";

type uploadData = {
  author: string;
  content: string;
  image?: File;
};

const PostPrompt = () => {
  const { user } = useContext(AuthContext);
  const [modalOpen, setModalOpen] = useState(false);
  const [triggerImageInput, setTriggerImageInput] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [postInput, setPostInput] = useState("");
  const [flash, setFlash] = useState("");
  const queryClient = useQueryClient();

  const publishPost = async () => {
    try {
      const formData: FormData = new FormData();
      formData.append("author", user?._id);
      formData.append("content", postInput);
      if (image) {
        formData.append("image", image);
      }

      const { data } = await axios.post("/api/posts", formData);
      return data;
    } catch (err) {
      console.error(err);
    }
  };

  const mutation = useMutation(publishPost, {
    onSuccess: () => {
      queryClient.invalidateQueries("profile posts");
      queryClient.invalidateQueries("newsfeed");
      queryClient.invalidateQueries(`imagePosts ${user._id}`);

      setPostInput("");
      setImage(null);
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

  // IMAGE UPLOADER
  const imageInput = useRef<HTMLInputElement | null>(null);

  const openImageUploader = async (e: SyntheticEvent) => {
    e.preventDefault();
    setModalOpen(true);
    setTriggerImageInput(true);
  };

  useEffect(() => {
    if (triggerImageInput) {
      imageInput.current?.click();
      setTriggerImageInput(false);
    }
  }, [triggerImageInput]);

  const handleImageSelection = () => {
    if (imageInput.current?.files) {
      const file = imageInput.current.files[0];
      if (!/image/i.test(file.type)) {
        alert("File " + file.name + " is not an image.");
        setImage(null);
        return;
      }
      setImage(file);
    }
  };

  const Button: ReactNode = (() => {
    if (!image) {
      return (
        <div className="grid place-items-center">
          <button
            className="flex items-center justify-center py-2 my-2 w-full rounded-full bg-emerald-200 hover:bg-emerald-300"
            onClick={openImageUploader}
          >
            <MdPhotoLibrary color="#10b981" size="2rem" />
            <span className=" font-roboto font-medium text-zinc-600 pl-3">
              Add a photo
            </span>
          </button>
        </div>
      );
    } else {
      return (
        <>
          <div className="flex space-x-2">
            <button
              className="flex items-center justify-center py-2 my-2 w-full rounded-full bg-emerald-200 hover:bg-emerald-300"
              onClick={openImageUploader}
            >
              <MdPhotoLibrary color="#10b981" size="2rem" />
              <span className=" font-roboto font-medium text-zinc-600 pl-3">
                Change photo
              </span>
            </button>
            <button
              className="flex items-center justify-center py-2 my-2 w-full rounded-full bg-red-200 hover:bg-red-300"
              onClick={(e) => {
                e.preventDefault();
                setImage(null);
              }}
            >
              <MdPhotoLibrary className="text-red-400" size="2rem" />
              <span className=" font-roboto font-medium text-zinc-600 pl-3">
                Remove photo
              </span>
            </button>
          </div>
        </>
      );
    }
  })();

  if (user) {
    return (
      <WhiteBox>
        <div className="flex items-center mb-0 pb-2 border-b border-b-zinc-300 h-12">
          <UserThumbnail />
          <button
            onClick={() => setModalOpen(true)}
            className="w-full ml-2 p-2 pl-4 rounded-full bg-zinc-200 font-roboto flex items-center justify-start text-zinc-500"
          >
            <span> What's on your mind, {user.firstName}?</span>
          </button>
        </div>
        <div className="grid place-items-center">
          <button
            className="flex items-center justify-center pt-3 w-full rounded-full"
            onClick={openImageUploader}
          >
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
              encType="multipart/form-data"
            >
              <textarea
                className="my-3 w-full h-32 placeholder:font-roboto placeholder:text-zinc-600 placeholder:text-xl focus:placeholder:text-zinc-400 resize-none outline-none"
                placeholder={`What's on your mind, ${user?.firstName}?`}
                aria-label="post input"
                name="post"
                autoFocus
                value={postInput}
                onChange={(e) => setPostInput(e.target.value)}
              />

              <span className="my-2 text-red-500 text-sm">{flash}</span>
              {image && (
                <div className="flex items-center justify-center m-3">
                  <img
                    src={URL.createObjectURL(image)}
                    alt="your chosen file"
                    className="w-[60%]"
                  />
                </div>
              )}
              {Button}

              <PrimaryButton
                onClick={async () => {}}
                type="submit"
                disabled={!postInput && !image}
              >
                Post
              </PrimaryButton>
              <input
                type="file"
                className="hidden"
                ref={imageInput}
                accept="image/*"
                onChange={handleImageSelection}
                data-testid="image-input"
              />
            </form>
          </div>
        </Modal>
      </WhiteBox>
    );
  } else {
    return <div></div>;
  }
};

export default PostPrompt;
