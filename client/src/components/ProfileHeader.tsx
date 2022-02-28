import React, { FC, ReactNode } from "react";
import UserThumbnail from "./common/UserThumbnail";
import { User } from "../types/User";
import Tab from "./common/Tab";

type Props = {
  user: User;
  children?: ReactNode;
  mainURL: string; // this is used for the 'Posts' tab in the profile header. Would either by '/profile' or '/profile/:uid'
};

const ProfileHeader: FC<Props> = ({ children, user, mainURL }) => {
  return (
    <div className=" bg-zinc-100 pt-10 flex justify-center shadow-md">
      <header className=" w-full md:w-[60vw] ">
        <div className="w-full flex items-center border-b border-zinc-300 pb-3  px-2 md:px-0">
          <div className=" h-20 md:h-36">
            <UserThumbnail id={user._id} />
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

            {children}
          </div>
        </div>
        <nav>
          <ul className="flex">
            <Tab end={true} title="Posts" to={mainURL} />
            <Tab end={false} title="Friends" to="friends" />
            <Tab title="Photos" to="photos" />
          </ul>
        </nav>
      </header>
    </div>
  );
};

export default ProfileHeader;
