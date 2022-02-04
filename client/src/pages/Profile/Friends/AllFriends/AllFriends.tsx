import axios from "axios";
import { useContext } from "react";
import FriendTile from "../../../../components/common/FriendTile";
import { AuthContext, User } from "../../../../contexts/Auth";
import { useQuery } from "react-query";

const AllFriends = () => {
  const { user } = useContext(AuthContext);

  const getFriends = async () => {
    try {
      const results = await Promise.all(
        user.friends.map(async (fid: string) => {
          const friendDocument = await axios.get(`/api/users/${fid}`);
          return friendDocument.data;
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

  return (
    <section className=" mt-3 grid grid-cols-2 gap-1">
      {friends &&
        friends.map((contact: User) => (
          <FriendTile key={contact._id} contact={contact} />
        ))}
    </section>
  );
};

export default AllFriends;
