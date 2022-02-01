import { useState, useEffect } from "react";
import axios from "axios";
import FriendTile from "../../../components/common/FriendTile";
import { User } from "../../../contexts/Auth";

const FindFriends = () => {
  const [contacts, setContacts] = useState<User[] | null>(null);

  useEffect(() => {
    async function getUsers() {
      const response = await axios.get("/api/users");
      console.log(response.data);
      setContacts(response.data);
    }
    getUsers();
  }, []);

  return (
    <section className=" mt-3 grid grid-cols-2 gap-1">
      {contacts &&
        contacts.map((contact: User) => (
          <FriendTile key={contact._id} contact={contact} />
        ))}
    </section>
  );
};

export default FindFriends;
