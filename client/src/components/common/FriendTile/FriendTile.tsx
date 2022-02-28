import { FC, useContext, ReactNode } from "react";

import defaultProfileImage from "../../../images/defaultUserPicture.jpeg";
import { Link, useParams, useMatch, useLocation } from "react-router-dom";
import SecondaryButton from "../SecondaryButton";
import { AuthContext } from "../../../contexts/Auth";
import { User } from "../../../types/User";
import axios from "axios";
import { useMutation, useQueryClient } from "react-query";

// make skeleton friend tile

type Props = {
  contact: User;
};

const FriendTile: FC<Props> = ({ contact }) => {
  const { user } = useContext(AuthContext);

  const location = useLocation();

  const queryClient = useQueryClient();

  const sendRequest = useMutation(
    async () => {
      try {
        await axios.post("/api/friendRequests", {
          fid: contact._id,
        });
      } catch (err: any) {
        console.log(err.response.data.message);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("userState");
      },
    }
  );

  const cancelRequest = useMutation(
    async () => {
      try {
        await axios.delete("/api/friendRequests", {
          data: {
            fid: contact._id,
          },
        });
      } catch (err: any) {
        console.log(err.response.data.message);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("userState");
      },
    }
  );

  const acceptRequest = useMutation(
    async () => {
      try {
        await axios.post("/api/friendRequests/handle", {
          fid: contact._id,
          action: "accept",
        });
      } catch (err: any) {
        console.log(err.response.data.message);
      }
    },
    {
      onSuccess: () => queryClient.invalidateQueries("userState"),
    }
  );

  const removeFriend = useMutation(
    async () => {
      try {
        await axios.delete("/api/friendRequests/friends", {
          data: {
            fid: contact._id,
          },
        });
      } catch (err: any) {
        console.log(err.response.data.message);
      }
    },
    {
      onSuccess: () => queryClient.invalidateQueries("userState"),
    }
  );

  if (!user) {
    return null;
  }

  let Button: ReactNode;

  if (location.pathname.match(/profile/)) {
    const friends: boolean = user?.friends.includes(contact._id);
    const requestRecieved: boolean =
      !friends && user.inboundFriendRequests.includes(contact._id);
    const requestSent: boolean =
      !friends && user.outboundFriendRequests.includes(contact._id);

    switch (true) {
      case friends:
        Button = (
          <SecondaryButton
            onClick={async () => {
              removeFriend.mutate();
            }}
          >
            <h3>Remove</h3>
          </SecondaryButton>
        );
        break;
      case requestSent:
        Button = (
          <SecondaryButton
            className="bg-red-200 text-red-600 hover:bg-red-300"
            onClick={async () => {
              cancelRequest.mutate();
            }}
          >
            <h3>Cancel Request</h3>
          </SecondaryButton>
        );
        break;
      case requestRecieved:
        Button = (
          <SecondaryButton
            className="bg-blue-200 text-blue-600 hover:bg-blue-300"
            onClick={async () => {
              acceptRequest.mutate();
            }}
          >
            <h3>Accept Request</h3>
          </SecondaryButton>
        );
        break;
      default:
        Button = (
          <SecondaryButton
            className="bg-blue-200 text-blue-600 hover:bg-blue-300"
            onClick={async () => {
              sendRequest.mutate();
            }}
          >
            <h3>Add Friend</h3>
          </SecondaryButton>
        );
    }
  }

  return (
    <div className=" flex items-center justify-between border-zinc-300 border rounded-xl p-3">
      <Link
        to={`/users/${contact._id}`}
        className="flex items-center flex-grow hover:text-facebook-blue"
      >
        <div className="overflow-hidden rounded-xl h-20 aspect-square">
          <img
            src={
              contact.displayPhoto
                ? `/api/images/${contact.displayPhoto}`
                : defaultProfileImage
            }
            alt="profile"
            className=" min-w-full min-h-full"
          />
        </div>

        <h3 className=" font-medium ml-3 flex-grow">{contact.fullName}</h3>
      </Link>
      {Button}
    </div>
  );
};

export default FriendTile;
