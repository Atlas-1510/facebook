import { FC, useContext } from "react";
import { AuthContext } from "../../contexts/Auth";
import UserThumbnail from "../../components/common/UserThumbnail";
import { RiPencilFill } from "react-icons/ri";
import Tab from "../../components/common/Tab";
import WhiteBox from "../../components/common/WhiteBox";
import SecondaryButton from "../../components/common/SecondaryButton";
import { Link, Outlet, Routes, Route } from "react-router-dom";
import PostPrompt from "../../components/common/PostPrompt";
import Post from "../../components/common/Post";
import Posts from "./Posts";
import Friends from "./Friends/Friends";
import Photos from "./Photos";

const Profile: FC = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="  min-h-screen relative -top-5">
      <div className=" bg-zinc-100 pt-10 flex justify-center shadow-md">
        <header className=" w-full md:w-[60vw] ">
          <div className="w-full flex items-center border-b border-zinc-300 pb-3  px-2 md:px-0">
            <div className=" h-20 md:h-36">
              <UserThumbnail />
            </div>
            <div className=" flex justify-between items-end ml-4 translate-y-5 w-full">
              <div>
                <h1 className=" text-4xl font-medium text-zinc-800">
                  {user?.fullName}
                </h1>
                <span className=" text-zinc-500">378 friends</span>
                <div>friend images here</div>
              </div>

              <SecondaryButton>
                <RiPencilFill className=" text-zinc-700 m-1 text-lg" />
                <span className=" ">Edit Profile</span>
              </SecondaryButton>
            </div>
          </div>
          <nav>
            <ul className="flex">
              <Tab end={true} title="Posts" to="/profile" />
              <Tab end={false} title="Friends" to="friends" />
              <Tab title="Photos" to="photos" />
            </ul>
          </nav>
        </header>
      </div>
      <main className=" flex justify-center flex-grow mt-3">
        <div className="grid grid-cols-5 w-full md:w-[60vw] gap-3">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Profile;
