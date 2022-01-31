import { FC, useContext } from "react";
import { AuthContext } from "../contexts/Auth";
import UserThumbnail from "../components/common/UserThumbnail";
import { RiPencilFill } from "react-icons/ri";
import ProfileTab from "../components/common/ProfileTab";

const Profile: FC = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="  min-h-screen relative -top-5">
      <div className=" bg-zinc-100 pt-10 flex justify-center">
        <header className=" w-full md:w-[60vw] ">
          <div className="w-full flex items-center border-b border-zinc-300 pb-3  px-2 md:px-0">
            <div className=" h-20 md:h-32">
              <UserThumbnail />
            </div>
            <div className=" flex justify-between items-end ml-3 mt-5  w-full">
              <div>
                <h1 className=" text-2xl font-medium">{user?.fullName}</h1>
                <span className=" text-zinc-500">378 friends</span>
                <div>friend images here</div>
              </div>
              <button className=" bg-zinc-200 hover:bg-zinc-300 flex items-center px-2 py-1 rounded-md">
                <RiPencilFill className=" text-zinc-700 m-1 text-lg" />
                <span className=" font-medium text-zinc-700 text-sm">
                  Edit Profile
                </span>
              </button>
            </div>
          </div>
          <nav>
            <ul className="flex">
              <ProfileTab title="Posts" to="x" />
              <ProfileTab title="About" to="" />
              <ProfileTab title="Friends" to="x" />
              <ProfileTab title="Photos" to="" />
            </ul>
          </nav>
        </header>
      </div>
      <main></main>
    </div>
  );
};

export default Profile;
