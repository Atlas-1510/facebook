import { AuthContext, User } from "../../../../contexts/Auth";
import FriendTile from "../../../../components/common/FriendTile";
import { useContext, useEffect, useRef } from "react";
import axios from "axios";
import { useQuery } from "react-query";
import { useOutletContext } from "react-router-dom";

const Requests = () => {
  const { user } = useContext(AuthContext);
  const searchInput: string = useOutletContext();
  console.log(searchInput);

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

  const generateTile = (contact: User) => (
    <FriendTile key={contact._id} contact={contact} />
  );

  const filterRequests = (arr: User[]) => {
    return arr.filter((friend: User) =>
      friend.fullName.toLowerCase().includes(searchInput.toLowerCase())
    );
  };

  let filteredInboundRequests = (() => {
    if (!requests || !requests.inbound) {
      return [];
    }
    if (!searchInput) {
      return requests.inbound;
    } else {
      return filterRequests(requests.inbound);
    }
  })();

  let filteredOutboundRequests = (() => {
    if (!requests || !requests.outbound) {
      return [];
    }
    if (!searchInput) {
      return requests.outbound;
    } else {
      return filterRequests(requests.outbound);
    }
  })();

  return (
    <section className=" mt-3">
      <div className="flex flex-col my-3">
        <h2 className="text-zinc-800 font-medium text-xl mb-2">Sent</h2>
        <div className=" mt-3 grid grid-cols-2 gap-1">
          {filteredOutboundRequests &&
            filteredOutboundRequests.map(generateTile)}
        </div>
      </div>

      <div className="flex flex-col my-3">
        <h2 className="text-zinc-800 font-medium text-xl mb-2">Recieved</h2>
        <div className=" mt-3 grid grid-cols-2 gap-1">
          {filteredInboundRequests && filteredInboundRequests.map(generateTile)}
        </div>
      </div>
    </section>
  );
};

export default Requests;
