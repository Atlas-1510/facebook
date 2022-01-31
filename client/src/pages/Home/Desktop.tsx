import { FC } from "react";
import PostPrompt from "../../components/common/PostPrompt";

const Home: FC = () => {
  return (
    <main className="grid grid-cols-4">
      <div className="col-start-2 col-span-2">
        <PostPrompt />
      </div>
    </main>
  );
};

export default Home;
