import { FC, useContext } from "react";
import { AuthContext } from "../contexts/Auth";
import UserThumbnail from "../components/common/UserThumbnail";
import { RiPencilFill } from "react-icons/ri";
import ProfileTab from "../components/common/ProfileTab";
import WhiteBox from "../components/common/WhiteBox";
import SecondaryButton from "../components/common/SecondaryButton";
import { Link } from "react-router-dom";
import PostPrompt from "../components/common/PostPrompt";
import Post from "../components/common/Post";

const Profile: FC = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="  min-h-screen relative -top-5">
      <div className=" bg-zinc-100 pt-10 flex justify-center shadow-md">
        <header className=" w-full md:w-[60vw] ">
          <div className="w-full flex items-center border-b border-zinc-300 pb-3  px-2 md:px-0">
            <div className=" h-20 md:h-32">
              <UserThumbnail />
            </div>
            <div className=" flex justify-between items-end ml-3 mt-5  w-full">
              <div>
                <h1 className=" text-2xl font-medium text-zinc-800">
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
              <ProfileTab title="Posts" to="x" />
              <ProfileTab title="About" to="" />
              <ProfileTab title="Friends" to="x" />
              <ProfileTab title="Photos" to="" />
            </ul>
          </nav>
        </header>
      </div>
      <div className=" flex justify-center bg-emerald-300 flex-grow mt-3">
        <div className=" bg-amber-300 w-full md:w-[60vw] grid grid-cols-5 gap-3">
          <div className="bg-indigo-300 col-span-2 hidden md:flex flex-col justify-end">
            <div className="space-y-3 sticky bottom-3 flex flex-col bg-red-300">
              <WhiteBox>
                <h2 className=" text-zinc-800 font-medium text-lg mb-2">
                  Intro
                </h2>
                <div className=" space-y-3">
                  <SecondaryButton className="w-full">
                    <span>Add Bio</span>
                  </SecondaryButton>
                </div>
              </WhiteBox>
              <WhiteBox>
                <div className=" flex justify-between items-baseline">
                  <h2 className=" text-zinc-800 font-medium text-lg mb-2">
                    Photos
                  </h2>
                  <Link to="photos" className=" text-facebook-blue text-sm">
                    See All Photos
                  </Link>
                </div>

                <ul className="  grid grid-cols-3 grid-rows-3 gap-2">
                  <li className="aspect-square bg-cyan-300">1</li>
                  <li className="aspect-square bg-cyan-300">2</li>
                  <li className="aspect-square bg-cyan-300">3</li>
                  <li className="aspect-square bg-cyan-300">4</li>
                  <li className="aspect-square bg-cyan-300">5</li>
                  <li className="aspect-square bg-cyan-300">6</li>
                  <li className="aspect-square bg-cyan-300">7</li>
                  <li className="aspect-square bg-cyan-300">8</li>
                  <li className="aspect-square bg-cyan-300">9</li>
                </ul>
              </WhiteBox>
              <WhiteBox>
                <div className=" flex justify-between items-baseline">
                  <h2 className=" text-zinc-800 font-medium text-lg mb-2">
                    Photos
                  </h2>
                  <Link to="photos" className=" text-facebook-blue text-sm">
                    See All Friends
                  </Link>
                </div>
                <ul className="  grid grid-cols-3 grid-rows-3 gap-2">
                  <li className="aspect-square bg-cyan-300">1</li>
                  <li className="aspect-square bg-cyan-300">2</li>
                  <li className="aspect-square bg-cyan-300">3</li>
                  <li className="aspect-square bg-cyan-300">4</li>
                  <li className="aspect-square bg-cyan-300">5</li>
                  <li className="aspect-square bg-cyan-300">6</li>
                  <li className="aspect-square bg-cyan-300">7</li>
                  <li className="aspect-square bg-cyan-300">8</li>
                  <li className="aspect-square bg-cyan-300">9</li>
                </ul>
              </WhiteBox>
            </div>
          </div>
          <div className=" bg-fuchsia-300 col-span-5 md:col-span-3">
            <div>
              <PostPrompt />
              <Post />
              <Post />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
