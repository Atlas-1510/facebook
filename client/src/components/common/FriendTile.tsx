import { FC, useContext, ReactNode, SyntheticEvent } from "react";

import testProfileImage from "../../images/test_profile_image.jpeg";
import { Link } from "react-router-dom";
import SecondaryButton from "./SecondaryButton";
import { User, AuthContext } from "../../contexts/Auth";
import axios from "axios";

type Props = {
  contact: User;
};

const FriendTile: FC<Props> = ({ contact }) => {
  const { user } = useContext(AuthContext);

  const handleSendRequest = async (e: SyntheticEvent): Promise<void> => {
    e.preventDefault();
    console.log("Send request");
  };
  if (!user) {
    return null;
  }

  let Button: ReactNode;

  const friends: boolean = user?.friends.includes(contact._id);
  const requestRecieved: boolean =
    !friends && user.inboundFriendRequests.includes(contact._id);
  const requestSent: boolean =
    !friends && user.outboundFriendRequests.includes(contact._id);

  switch (true) {
    case friends:
      Button = (
        <SecondaryButton>
          <h3>Remove</h3>
        </SecondaryButton>
      );
      break;
    case requestSent:
      Button = (
        <SecondaryButton className="bg-red-200 text-red-600 hover:bg-red-300">
          <h3>Cancel Request</h3>
        </SecondaryButton>
      );
      break;
    case requestRecieved:
      Button = (
        <SecondaryButton className="bg-blue-200 text-blue-600 hover:bg-blue-300">
          <h3>Accept Request</h3>
        </SecondaryButton>
      );
      break;
    default:
      Button = (
        <SecondaryButton
          className="bg-blue-200 text-blue-600 hover:bg-blue-300"
          onClick={handleSendRequest}
        >
          <h3>Add Friend</h3>
        </SecondaryButton>
      );
  }

  return (
    <div className=" flex items-center justify-between border-zinc-300 border rounded-xl p-3">
      <Link
        to="something"
        className="flex items-center flex-grow hover:text-facebook-blue"
      >
        <img src={testProfileImage} alt="profile" className="rounded-xl h-20" />
        <h3 className=" font-medium ml-3 flex-grow">{contact.fullName}</h3>
      </Link>
      {Button}
    </div>
  );
};

export default FriendTile;
