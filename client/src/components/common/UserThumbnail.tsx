import { useContext, FC } from "react";
import { AuthContext } from "../../contexts/Auth";
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
      console.log(err);
      throw err;
    }
  };

  const { data: user } = useQuery(`user ${id}`, getUser);

  if (!user) {
    return <div>loading</div>;
  }

  return (
    <div className="aspect-square h-full">
      <img
        src={
          user.displayPhoto
            ? `/api/images/${user.displayPhoto}`
            : defaultUserPicture
        }
        alt="user"
        className="rounded-full h-full w-auto"
      />
    </div>
  );
};

export default UserThumbnail;
