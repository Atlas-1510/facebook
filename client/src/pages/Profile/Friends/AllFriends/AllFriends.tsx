import axios from "axios";
import { useContext } from "react";
import FriendTile from "../../../../components/common/FriendTile/FriendTile";
import { AuthContext } from "../../../../contexts/Auth";
import { User } from "../../../../types/User";
import { useQuery } from "react-query";
import { useOutletContext } from "react-router-dom";
import SkeletonFriendTile from "../../../../components/common/FriendTile/SkeletonFriendTile";

const AllFriends = () => {
  const { user } = useContext(AuthContext);
  const searchInput: string = useOutletContext();

  const getFriends = async () => {
    try {
      const results = await Promise.all(
        user.friends.map(async (fid: string) => {
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
  );
};

export default AllFriends;
