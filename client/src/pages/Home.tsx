import { FC } from "react";
import PostPrompt from "../components/common/PostPrompt";

const Home: FC = () => {
  return (
    <main className="md:grid md:grid-cols-4">
      <div className="flex flex-col md:col-start-2 md:col-span-2">
        <PostPrompt />
      </div>
    </main>
  );
};

export default Home;
