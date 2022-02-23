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
      {user.displayPhoto && (
        <img
          src={`/api/images/${user.displayPhoto}`}
          alt="user"
          className=" h-full"
        />
      )}
      {!user.displayPhoto && (
        <img src={defaultUserPicture} alt="Default user" className=" h-full" />
      )}
    </div>
  );
};

export default UserThumbnail;
