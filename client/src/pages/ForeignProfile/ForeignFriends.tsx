import React, { useState, useContext } from "react";
import { AuthContext } from "../../contexts/Auth";
import WhiteBox from "../../components/common/WhiteBox";
import SearchBar from "../../components/SearchBar";
import Tab from "../../components/common/Tab";
import SkeletonFriendTile from "../../components/FriendTile/SkeletonFriendTile";
import axios from "axios";
import { useQuery } from "react-query";
import FriendTile from "../../components/FriendTile/FriendTile";
import { User } from "../../types/User";

const ForeignFriends = () => {
  const [searchInput, setSearchInput] = useState("");

  const { user } = useContext(AuthContext);

  const getFriends = async () => {
    try {
      const results = await Promise.all(
        user!.friends.map(async (fid: string) => {
          const { data } = await axios.get(`/api/users/${fid}`);
          return data;
        })
      );
      return results;
    } catch (err) {
      console.log(err);
    }
  };

  const { data: friends, status } = useQuery("friends", getFriends, {
    enabled: !!user?._id,
  });

  const generateTile = (contact: User) => (
    <FriendTile key={contact._id} contact={contact} />
  );

  const tiles = (() => {
    if (!friends) {
      return null;
    } else if (!searchInput) {
      return friends.map(generateTile);
    } else {
      const filteredFriends = friends.filter((friend: User) =>
        friend.fullName.toLowerCase().includes(searchInput.toLowerCase())
      );
      return filteredFriends.map(generateTile);
    }
  })();

  return (
    <div className="col-span-5">
      <WhiteBox>
        <div className="flex justify-between items-start">
          <h2 className=" text-zinc-800 font-medium text-2xl mb-2">Friends</h2>
          <div>
            <SearchBar
              placeholder="Search friends"
              value={searchInput}
              setValue={setSearchInput}
            />
          </div>
        </div>
        <ul className="flex">
          <Tab end={true} title="All Friends" to="" />
        </ul>
        <section className=" mt-3 grid grid-cols-2 gap-1">
          {status === "loading" && (
            <>
              <SkeletonFriendTile />
              <SkeletonFriendTile />
              <SkeletonFriendTile />
              <SkeletonFriendTile />
              <SkeletonFriendTile />
              <SkeletonFriendTile />
            </>
          )}

          {status === "error" && <div>Error fetching data</div>}
          {status === "success" && friends && tiles}
        </section>
      </WhiteBox>
    </div>
  );
};

export default ForeignFriends;
