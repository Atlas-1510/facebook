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

  console.log(user);

  if (isLoading) {
    return <div>Loading</div>;
  }
  if (isError) {
    return <div>Error</div>;
  } else {
    return (
      <div className="  min-h-screen relative -top-5">
        <div className=" bg-zinc-100 pt-10 flex justify-center shadow-md">
          <header className=" w-full md:w-[60vw] ">
            <div className="w-full flex items-center border-b border-zinc-300 pb-3  px-2 md:px-0">
              <div className=" h-20 md:h-36">
                <UserThumbnail id={id} />
              </div>
              <div className=" flex justify-between items-end ml-4 translate-y-3 w-full">
                <div>
                  <h1 className=" text-4xl font-medium text-zinc-800">
                    {user?.fullName}
                  </h1>
                  <span className=" text-zinc-500">
                    {(() => {
                      const length = user?.friends.length;
                      return `${length} ${length === 1 ? "friend" : "friends"}`;
                    })()}
                  </span>
                </div>
              </div>
            </div>
            <nav>
              <ul className="flex">
                <Tab end={true} title="Posts" to={`profile/${user!._id}`} />
                <Tab end={false} title="Friends" to="friends" />
                <Tab title="Photos" to="photos" />
              </ul>
            </nav>
          </header>
        </div>
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
