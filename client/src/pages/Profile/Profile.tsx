import { FC, useContext, useState } from "react";
import { AuthContext } from "../../contexts/Auth";
import UserThumbnail from "../../components/common/UserThumbnail";
import { RiPencilFill } from "react-icons/ri";
import Tab from "../../components/common/Tab";
import SecondaryButton from "../../components/common/SecondaryButton";
import { Outlet, useParams, useOutletContext } from "react-router-dom";
import Modal from "../../components/Modal";
import EditProfile from "./EditProfile";
import { User } from "../../types/User";
import ProfileHeader from "../../components/common/ProfileHeader";

type ContextType = { user: User | null };

export function useUser() {
  return useOutletContext<ContextType>();
}

const Profile = () => {
  const { user, getUserState } = useContext(AuthContext);
  const [editProfileModal, setEditProfileModal] = useState(false);

  if (!user) {
    return <div>loading</div>;
  }

  return (
    <div className="  min-h-screen relative -top-5">
      <ProfileHeader user={user}>
        <SecondaryButton onClick={() => setEditProfileModal(true)}>
          <RiPencilFill className=" text-zinc-700 m-1 text-lg" />
          <span className=" ">Edit Profile</span>
        </SecondaryButton>
      </ProfileHeader>
      <main className=" flex justify-center flex-grow mt-3">
        <Modal
          open={editProfileModal}
          onClose={() => {
            getUserState();
            setEditProfileModal(false);
          }}
          title="Edit Profile"
        >
          <EditProfile />
        </Modal>
        <div className="grid grid-cols-5 w-full md:w-[60vw] gap-3">
          <Outlet context={{ user: user }} />
        </div>
      </main>
    </div>
  );
};

export default Profile;
