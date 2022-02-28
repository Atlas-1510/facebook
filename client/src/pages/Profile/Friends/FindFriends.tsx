import { useContext } from "react";
import axios from "axios";
import FriendTile from "../../../components/FriendTile/FriendTile";
import { User } from "../../../types/User";
import { AuthContext } from "../../../contexts/Auth";
import { useQuery } from "react-query";
import { useOutletContext } from "react-router-dom";
import SkeletonFriendTile from "../../../components/FriendTile/SkeletonFriendTile";

// TODO: Implement pagination

const FindFriends = () => {
  const { user } = useContext(AuthContext);
  const searchInput: string = useOutletContext();

  async function getAllUsers() {
    try {
      const response = await axios.get("/api/users");

      const result = [...response.data].filter(
        (contact) => contact._id !== user?._id
      );

      return result;
    } catch (err: any) {
      console.log(err.response);
    }
  }

  const { data: allUsers, status } = useQuery("allUsers", getAllUsers, {
    enabled: !!user?._id,
  });

  const generateTile = (contact: User) => (
    <FriendTile key={contact._id} contact={contact} />
  );

  const tiles = (() => {
    if (!allUsers) {
      return null;
    } else if (!searchInput) {
      return allUsers.map(generateTile);
    } else {
      const filteredFriends = allUsers.filter((friend: User) =>
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
      {status === "success" && allUsers && tiles}
    </section>
  );
};

export default FindFriends;
