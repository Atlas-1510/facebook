import { FC } from "react";
import { Link } from "react-router-dom";

const Home: FC = () => {
  return (
    <>
      <div className=" grow">This is the home page</div>
      <Link to="/profile">Profile</Link>
    </>
  );
};

export default Home;
