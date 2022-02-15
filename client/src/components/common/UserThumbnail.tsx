import { useContext } from "react";
import { AuthContext } from "../../contexts/Auth";
import { User } from "../../types/User";
import defaultUserPicture from "../../images/defaultUserPicture.jpeg";

const UserThumbnail = () => {
  const { user }: { user: User } = useContext(AuthContext);
  if (!user || !user.displayPhoto) {
    return (
      <div className="rounded-full h-full aspect-square bg-blue-400 grid place-items-center">
        <img
          src={defaultUserPicture}
          alt="Default user"
          className=" rounded-full"
        />
      </div>
    );
  } else
    return (
      <img
        src={user.displayPhoto}
        alt="profile"
        className="rounded-full h-full aspect-square"
      />
    );
};

export default UserThumbnail;
