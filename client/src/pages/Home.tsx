import { FC } from "react";
import { Link } from "react-router-dom";

const Home: FC = () => {
  return (
    <div className=" bg-zinc-300 flex flex-col h-screen">
      <div className=" grow">This is the home page</div>
      <Link to="/profile">Profile</Link>
    </div>
  );
};

export default Home;
