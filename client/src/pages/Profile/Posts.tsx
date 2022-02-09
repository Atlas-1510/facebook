import WhiteBox from "../../components/common/WhiteBox";
import SecondaryButton from "../../components/common/SecondaryButton";
import PostStream from "../../components/common/PostStream";
import PostPrompt from "../../components/common/PostPrompt";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "react-query";
import axios from "axios";
import { PostInterface } from "../../types/PostInterface";
import { useReducer } from "react";
import Modal from "../../components/Modal";
import Post from "../../components/common/Post/Post";

const Posts = () => {
  const { uid } = useParams();

  const getImagePosts = async () => {
    try {
      const { data } = await axios.get(`/api/posts/getImagePosts/${uid}`);
      return data;
    } catch (err) {
      console.log(err);
    }
  };

  const { data: imagePosts } = useQuery(`imagePosts ${uid}`, getImagePosts, {
    enabled: !!uid,
  });

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

  if (!uid) {
    return <div>Something Went Wrong...</div>;
  } else
    return (
      <>
        <div className=" col-span-2 hidden md:flex flex-col justify-end">
          <div className="space-y-3 sticky bottom-3 flex flex-col">
            <WhiteBox>
              <h2 className=" text-zinc-800 font-medium text-lg mb-2">Intro</h2>
              <div className=" space-y-3">
                <SecondaryButton className="w-full">
                  <span>Add Bio</span>
                </SecondaryButton>
              </div>
            </WhiteBox>
            <WhiteBox>
              <div className=" flex justify-between items-baseline">
                <h2 className=" text-zinc-800 font-medium text-lg mb-2">
                  Photos
                </h2>
                <Link to="photos" className=" text-facebook-blue text-sm">
                  See All Photos
                </Link>
              </div>

              <ul className="grid grid-cols-3 grid-rows-3 gap-2 aspect-square">
                {imagePosts &&
                  imagePosts.map((post: PostInterface) => (
                    <li key={post._id}>
                      <button
                        className="w-full h-full flex justify-center items-center border border-zinc-300 rounded-md p-1 shadow-sm transition-all hover:scale-105"
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
            </WhiteBox>
            <WhiteBox>
              <div className=" flex justify-between items-baseline">
                <h2 className=" text-zinc-800 font-medium text-lg mb-2">
                  Friends
                </h2>
                <Link to="photos" className=" text-facebook-blue text-sm">
                  See All Friends
                </Link>
              </div>
              <ul className="  grid grid-cols-3 grid-rows-3 gap-2">
                <li className="aspect-square bg-cyan-300">1</li>
                <li className="aspect-square bg-cyan-300">2</li>
                <li className="aspect-square bg-cyan-300">3</li>
                <li className="aspect-square bg-cyan-300">4</li>
                <li className="aspect-square bg-cyan-300">5</li>
                <li className="aspect-square bg-cyan-300">6</li>
                <li className="aspect-square bg-cyan-300">7</li>
                <li className="aspect-square bg-cyan-300">8</li>
                <li className="aspect-square bg-cyan-300">9</li>
              </ul>
            </WhiteBox>
          </div>
        </div>
        <div className="  col-span-5 md:col-span-3">
          <PostPrompt />
          <PostStream id={uid} />
        </div>
        {modal.open && (
          <Modal
            open={modal.open}
            onClose={() => {
              modalDispatch({ type: "close", payload: null });
            }}
            title="Photo Modal"
          >
            <Post initialData={modal.data} />
          </Modal>
        )}
      </>
    );
};

export default Posts;
