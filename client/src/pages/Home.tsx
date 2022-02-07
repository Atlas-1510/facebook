import { FC } from "react";
import PostPrompt from "../components/common/PostPrompt";
import axios from "axios";
import { useQuery } from "react-query";
import Post from "../components/common/Post/Post";
import { PostInterface } from "../types/PostInterface";
import SkeletonPost from "../components/common/Post/SkeletonPost";

const Home: FC = () => {
  const getPosts = async () => {
    try {
      const { data } = await axios.get("/api/posts/newsfeed");
      return data;
    } catch (err) {
      console.log(err);
    }
  };

  const { status, data: newsfeed } = useQuery("newsfeed", getPosts);
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
              <Post key={post._id} post={post} />
            ))}
        </div>
      </div>
    </main>
  );
};

export default Home;
