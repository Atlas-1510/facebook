import { useContext, useReducer } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import axios from "axios";
import { PostInterface } from "../../types/PostInterface";
import Modal from "../../components/Modal";
import Post from "../../components/Post/Post";
import { AuthContext } from "../../contexts/Auth";

const Photos = () => {
  let id: string;
  const { uid } = useParams();
  const { user } = useContext(AuthContext);

  if (uid) {
    id = uid;
  } else {
    id = user!._id;
  }

  const getImagePosts = async (imageLimit: number) => {
    try {
      const { data } = await axios.get(`/api/posts/getImagePosts/${id}`, {
        params: { limit: imageLimit },
      });
      return data;
    } catch (err) {
      console.log(err);
    }
  };

  const imageLimit = 0; // 0 means there is no image limit

  const { data: imagePosts } = useQuery(
    [`imagePosts ${id}`, imageLimit],
    () => getImagePosts(imageLimit),
    {
      enabled: !!id,
    }
  );

  const initialModalState = { open: false, data: null };

  type ACTIONTYPE =
    | { type: "open"; payload: { pid: string } }
    | { type: "close"; payload: null };

  const modalReducer = (
    state: typeof initialModalState,
    action: ACTIONTYPE
  ) => {
    switch (action.type) {
      case "open":
        const post = imagePosts.find(
          (element: PostInterface) => element._id === action.payload.pid
        );
        return { open: true, data: post };
      case "close":
        return { open: false, data: null };
    }
  };

  const [modal, modalDispatch] = useReducer(modalReducer, initialModalState);

  return (
    <>
      <div className="col-span-5">
        <ul className="grid grid-cols-3 grid-rows-3 gap-2 aspect-square">
          {imagePosts &&
            imagePosts.map((post: PostInterface) => (
              <li key={post._id}>
                <button
                  className="w-full h-full flex justify-center items-center border border-zinc-300 rounded-md p-1 shadow-sm transition-all hover:scale-105 bg-zinc-100"
                  onClick={(e) => {
                    e.preventDefault();
                    modalDispatch({
                      type: "open",
                      payload: { pid: post._id },
                    });
                  }}
                >
                  <img
                    src={`/api/images/${post.image}`}
                    alt="user uploaded"
                    className="= max-w-full max-h-full"
                  />
                </button>
              </li>
            ))}
        </ul>
      </div>
      {modal.open && (
        <Modal
          open={modal.open}
          onClose={() => {
            modalDispatch({ type: "close", payload: null });
          }}
        >
          <Post initialData={modal.data} />
        </Modal>
      )}
    </>
  );
};

export default Photos;
