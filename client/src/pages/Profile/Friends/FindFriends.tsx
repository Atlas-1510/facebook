import { useState, useEffect, useContext } from "react";
import axios from "axios";
import FriendTile from "../../../components/common/FriendTile";
import { User } from "../../../contexts/Auth";
import { AuthContext } from "../../../contexts/Auth";
import { useQuery } from "react-query";

const FindFriends = () => {
  const { user } = useContext(AuthContext);

  async function getAllUsers() {
    try {
      const response = await axios.get("/api/users");
      return [...response.data].filter((contact) => contact._id !== user?._id);
    } catch (err: any) {
      console.log(err.response);
    }
  }

  const { data: allUsers } = useQuery("allUsers", getAllUsers);

  return (
    <section className=" mt-3 grid grid-cols-2 gap-1">
      {allUsers &&
        allUsers.map((contact: User) => (
          <FriendTile key={contact._id} contact={contact} />
        ))}
    </section>
  );
};

export default FindFriends;