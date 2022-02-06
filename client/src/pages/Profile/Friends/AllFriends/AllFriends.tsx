import axios from "axios";
import { useContext } from "react";
import FriendTile from "../../../../components/common/FriendTile/FriendTile";
import { AuthContext, User } from "../../../../contexts/Auth";
import { useQuery } from "react-query";
import { useOutletContext } from "react-router-dom";

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

  const { data: friends } = useQuery("friends", getFriends, {
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
      {friends && tiles}
    </section>
  );
};

export default AllFriends;
