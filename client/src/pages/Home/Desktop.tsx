import { FC } from "react";
import Post from "../../components/common/Post";
import PostPrompt from "../../components/common/PostPrompt";

const Home: FC = () => {
  return (
    <main className="grid grid-cols-4">
      <div className="col-start-2 col-span-2">
        <PostPrompt />
        <Post />
        <Post />
        <Post />
        <Post />
      </div>
    </main>
  );
};

export default Home;
