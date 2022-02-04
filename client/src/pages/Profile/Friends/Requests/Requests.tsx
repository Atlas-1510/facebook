import { AuthContext, User } from "../../../../contexts/Auth";
import FriendTile from "../../../../components/common/FriendTile";
import { useContext } from "react";
import axios from "axios";
import { useQuery } from "react-query";

const Requests = () => {
  const { user } = useContext(AuthContext);

  const getRequests = async () => {
    const inbound = await (async () => {
      try {
        const results = await Promise.all(
          user.inboundFriendRequests.map(async (fid: string) => {
            const { data } = await axios.get(`/api/users/${fid}`);
            return data;
          })
        );
        return results;
      } catch (err) {
        console.log(err);
      }
    })();

    const outbound = await (async () => {
      try {
        const results = await Promise.all(
          user.outboundFriendRequests.map(async (fid: string) => {
            const { data } = await axios.get(`/api/users/${fid}`);
            return data;
          })
        );
        return results;
      } catch (err) {
        console.log(err);
      }
    })();

    return { inbound, outbound };
  };

  const { data: requests } = useQuery("friendRequests", getRequests, {
    enabled: !!user?._id,
  });

  return (
    <section className=" mt-3">
      <div className="flex flex-col my-3">
        <h2 className="text-zinc-800 font-medium text-xl mb-2">Sent</h2>
        <div className=" mt-3 grid grid-cols-2 gap-1">
          {requests?.outbound &&
            requests.outbound.map((contact: User) => (
              <FriendTile key={contact._id} contact={contact} />
            ))}
        </div>
      </div>

      <div className="flex flex-col my-3">
        <h2 className="text-zinc-800 font-medium text-xl mb-2">Recieved</h2>
        <div className=" mt-3 grid grid-cols-2 gap-1">
          {requests?.inbound &&
            requests.inbound.map((contact: User) => (
              <FriendTile key={contact._id} contact={contact} />
            ))}
        </div>
      </div>
    </section>
  );
};

export default Requests;
