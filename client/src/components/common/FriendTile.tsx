import testProfileImage from "../../images/test_profile_image.jpeg";
import { Link } from "react-router-dom";
import SecondaryButton from "./SecondaryButton";

const FriendTile = () => {
  return (
    <div className=" flex items-center justify-between border-zinc-300 border rounded-xl p-3">
      <Link
        to="something"
        className="flex items-center hover:text-facebook-blue"
      >
        <img src={testProfileImage} alt="profile" className="rounded-xl h-20" />
        <h3 className=" font-medium ml-3">Steve Rogers</h3>
      </Link>
      <SecondaryButton>
        <h3>Remove</h3>
      </SecondaryButton>
    </div>
  );
};

export default FriendTile;
