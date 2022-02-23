import { useContext } from "react";
import { AuthContext } from "../../contexts/Auth";
import { User } from "../../types/User";
import defaultUserPicture from "../../images/defaultUserPicture.jpeg";

const UserThumbnail = () => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <div>loading</div>;
  }

  return (
    <div className="rounded-full h-full aspect-square bg-emerald-400 grid place-items-center overflow-hidden">
      <img
        src={
          user.displayPhoto
            ? `/api/images/${user.displayPhoto}`
            : defaultUserPicture
        }
        alt="user"
        className=" h-full"
      />
    </div>
  );
};

export default UserThumbnail;
