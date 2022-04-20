import {
  FC,
  useContext,
  useState,
  useEffect,
  useRef,
  SyntheticEvent,
} from "react";
import { PostInterface } from "../../types/PostInterface";
import UserThumbnail from "../common/UserThumbnail";
import { AuthContext } from "../../contexts/Auth";
import PrimaryButton from "../PrimaryButton";
import axios from "axios";
import { MdPhotoLibrary } from "react-icons/md";
import { useMutation, useQueryClient } from "react-query";

interface Props {
  post: PostInterface;
  onClose: () => void;
}

const EditPostForm: FC<Props> = ({ post, onClose }) => {
  const { user } = useContext(AuthContext);
  const [postContent, setPostContent] = useState(post.content);
  const [image, setImage] = useState<File | null>(null);
  const imageInput = useRef<HTMLInputElement | null>(null);
  const [flash, setFlash] = useState("");
  const queryClient = useQueryClient();

  useEffect(() => {
    const fetchImage = async () => {
      const result = await axios.get(`/api/images/${post?.image}`, {
        responseType: "blob",
      });
      setImage(result.data);
    };
    if (post.image) {
      fetchImage();
    }
  }, [post]);

  const handleImageSelection = () => {
    if (imageInput.current?.files) {
      const file = imageInput.current.files[0];
      if (!/image/i.test(file.type)) {
        alert("File " + file.name + " is not an image.");
        return;
      }
      setImage(file);
    }
  };

  const publishPost = async () => {
    try {
      const formData: FormData = new FormData();
      formData.append("author", user!._id);
      formData.append("content", postContent);
      if (image) {
        formData.append("image", image);
      }
      const { data } = await axios.put(`/api/posts/${post._id}`, formData);
      return data;
    } catch (err) {
      console.log(err);
    }
  };

  const mutation = useMutation(publishPost, {
    onSuccess: (data) => {
      queryClient.invalidateQueries(`post: ${post._id}`);
      // queryClient.invalidateQueries(`imagePosts ${user!._id}`);

      onClose();
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

  if (user) {
    return (
      <div className="flex flex-col w-full">
        <div className="h-10 flex items-center">
          <UserThumbnail id={user._id} />
          <span className=" font-roboto font-medium text-zinc-900 ml-2">
            {user.firstName}
          </span>
        </div>

        <form
          className="flex flex-col item-center w-full"
          onSubmit={handlePostSubmit}
          encType="multipart/form-data"
        >
          <textarea
            className="my-3 w-full h-32 placeholder:font-roboto placeholder:text-zinc-600 placeholder:text-xl focus:placeholder:text-zinc-400 resize-none outline-none"
            placeholder={`What's on your mind, ${user.firstName}?`}
            aria-label="post input"
            name="post"
            autoFocus
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
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
          {/* Add/Change/Remove photo buttons */}
          {image ? (
            <>
              <div className="flex space-x-2">
                <button
                  className="flex items-center justify-center py-2 my-2 w-full rounded-full bg-emerald-200 hover:bg-emerald-300"
                  onClick={(e) => {
                    e.preventDefault();
                    imageInput.current?.click();
                  }}
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
          ) : (
            <div className="grid place-items-center">
              <button
                className="flex items-center justify-center py-2 my-2 w-full rounded-full bg-emerald-200 hover:bg-emerald-300"
                onClick={(e) => {
                  e.preventDefault();
                  imageInput.current?.click();
                }}
              >
                <MdPhotoLibrary color="#10b981" size="2rem" />
                <span className=" font-roboto font-medium text-zinc-600 pl-3">
                  Add a photo
                </span>
              </button>
            </div>
          )}
          <PrimaryButton
            onClick={async () => {}}
            type="submit"
            disabled={!postContent}
          >
            Edit Post
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
    );
  }
  return null;
};

export default EditPostForm;
