import { useContext, FC } from "react";
import { AuthContext } from "../../contexts/Auth";
import { User } from "../../types/User";
import defaultUserPicture from "../../images/defaultUserPicture.jpeg";
import axios from "axios";
import { useQuery } from "react-query";

type Props = {
  id: string;
};

const UserThumbnail: FC<Props> = ({ id }) => {
  const { user: OwnUser } = useContext(AuthContext);
  const getUser = async () => {
    try {
      if (id) {
        const response = await axios.get(`/api/users/${id}`);
        return response.data;
      } else {
        return OwnUser;
      }
    } catch (err: any) {
      console.log(err.response.data);
      throw err;
    }
  };

  const {
    isLoading,
    isError,
    data: user,
    error,
  } = useQuery(`user ${id}`, getUser);

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
