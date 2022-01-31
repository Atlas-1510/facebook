import { useContext } from "react";
import { AuthContext } from "../../contexts/Auth";

import { HiUser } from "react-icons/hi";

const UserThumbnail = () => {
  const { user } = useContext(AuthContext);
  if (!user) {
    console.error(
      "UserThumbnail couldn't access user from AuthContext provider"
    );
    return null;
  }
  if (user.thumbnail) {
    return (
      <img
        src={user.thumbnail}
        alt="profile"
        className="rounded-full h-full aspect-square"
      />
    );
  } else {
    return (
      <div className="rounded-full h-full aspect-square bg-blue-400 grid place-items-center">
        <HiUser className=" text-zinc-200" size="1.5rem" />
      </div>
    );
  }
};

export default UserThumbnail;
