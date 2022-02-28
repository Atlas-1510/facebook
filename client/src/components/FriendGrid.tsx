import React, { FC, useContext } from "react";
import WhiteBox from "./common/WhiteBox";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/Auth";
import axios from "axios";
import { useQuery } from "react-query";
import { User } from "../types/User";

type Props = {
  id: string;
};

const FriendGrid: FC<Props> = ({ id }) => {
  const getFriend = async (id: string): Promise<User> => {
    const { data: friend } = await axios.get(`/api/users/${id}`);
    return friend;
  };

  const getFriends = async () => {
    const user = await getFriend(id);

    // for each friend, get their profile, get their image, load it. limit to nine
    if (!user) {
      return null;
    }
    let promises = [];
    for (let i = 0; i < 9; i++) {
      if (user.friends[i]) {
        promises.push(getFriend(user.friends[i]));
      }
    }
    const friends = await Promise.all(promises);

    return friends;
  };

  const { data: friends } = useQuery(`friends - ${id}`, getFriends);

  return (
    <WhiteBox>
      <div className=" flex justify-between items-baseline">
        <h2 className=" text-zinc-800 font-medium text-lg mb-2">Friends</h2>
        <Link to="friends" className=" text-facebook-blue text-sm">
          See All Friends
        </Link>
      </div>
      <ul className="  grid grid-cols-3 grid-rows-3 gap-2">
        {friends?.map((friend: User) => (
          <li key={friend._id}>
            <Link
              to={`/users/${friend._id}`}
              className=" aspect-square overflow-hidden w-full h-full flex justify-center items-center border border-zinc-300 rounded-md p-1 shadow-sm transition-all hover:scale-105"
            >
              <img
                src={`/api/images/${friend.displayPhoto}`}
                alt="user uploaded"
                className="= max-w-full max-h-full"
              />
            </Link>
          </li>
        ))}
      </ul>
    </WhiteBox>
  );
};

export default FriendGrid;
