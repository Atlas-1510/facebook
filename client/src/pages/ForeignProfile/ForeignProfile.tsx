import { FC, useContext } from "react";
import UserThumbnail from "../../components/common/UserThumbnail";
import Tab from "../../components/common/Tab";
import {
  Outlet,
  useNavigate,
  useOutletContext,
  useParams,
} from "react-router-dom";
import { useQuery } from "react-query";
import axios from "axios";
import { User } from "../../types/User";
import { AuthContext } from "../../contexts/Auth";
import ProfileHeader from "../../components/common/ProfileHeader";

const ForeignProfile: FC = () => {
  const navigate = useNavigate();
  const { uid: id } = useParams();
  const { user: currentUser } = useContext(AuthContext);

  if (id === currentUser?._id) {
    navigate("/profile", { replace: true });
  }

  const getUser = async () => {
    try {
      const response = await axios.get(`/api/users/${id}`);
      return response.data;
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

  if (isLoading) {
    return <div>Loading</div>;
  }
  if (isError) {
    return <div>Error</div>;
  } else {
    return (
      <div className="  min-h-screen relative -top-5">
        <ProfileHeader user={user} mainURL={`/users/${user!._id}`} />
        <main className=" flex justify-center flex-grow mt-3">
          <div className="grid grid-cols-5 w-full md:w-[60vw] gap-3">
            <Outlet context={{ user: user }} />
          </div>
        </main>
      </div>
    );
  }
};

export default ForeignProfile;
