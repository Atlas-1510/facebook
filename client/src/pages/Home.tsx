import { FC, useContext } from "react";
import PostPrompt from "../components/PostPrompt";
import axios from "axios";
import { useQuery } from "react-query";
import Post from "../components/Post/Post";
import { PostInterface } from "../types/PostInterface";
import SkeletonPost from "../components/Post/SkeletonPost";
import { AuthContext } from "../contexts/Auth";

const Home: FC = () => {
  const { user } = useContext(AuthContext);
  const getPosts = async () => {
    try {
      const { data } = await axios.get("/api/posts/newsfeed");
      return data;
    } catch (err) {
      console.log(err);
    }
  };

  const { status, data: newsfeed } = useQuery("newsfeed", getPosts, {
    enabled: !!user!._id,
  });
  if (newsfeed && newsfeed.hasOwnProperty("message")) {
    return <div>loading</div>;
  }
  return (
    <main className="md:grid md:grid-cols-4">
      <div className="flex flex-col md:col-start-2 md:col-span-2">
        <PostPrompt />
        <div>
          {status === "loading" && (
            <>
              <SkeletonPost />
              <SkeletonPost />
              <SkeletonPost />
              <SkeletonPost />
              <SkeletonPost />
            </>
          )}
          {status === "error" && <div>Unable to retrieve posts</div>}
          {status === "success" &&
            newsfeed &&
            newsfeed.map((post: PostInterface) => (
              <Post key={post._id} initialData={post} />
            ))}
        </div>
      </div>
    </main>
  );
};

export default Home;
