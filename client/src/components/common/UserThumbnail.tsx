import { useContext } from "react";
import { AuthContext } from "../../contexts/Auth";
import { User } from "../../types/User";
import { HiUser } from "react-icons/hi";

const UserThumbnail = () => {
  const { user }: { user: User } = useContext(AuthContext);
  if (!user || !user.thumbnail) {
    return (
      <div className="rounded-full h-full aspect-square bg-blue-400 grid place-items-center">
        <HiUser className=" text-zinc-200" size="1.5rem" />
      </div>
    );
  } else
    return (
      <img
        src={user.thumbnail}
        alt="profile"
        className="rounded-full h-full aspect-square"
      />
    );
};

export default UserThumbnail;
