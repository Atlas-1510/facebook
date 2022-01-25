import { FC, useContext } from "react";
import { UserContext } from "../contexts/User";
import { Link } from "react-router-dom";

const Profile: FC = () => {
  const user = useContext(UserContext);

  return (
    <div>
      <div>This is the profile page</div>
      <div>Current user is {user?.firstName}</div>
      <Link to="/">Home</Link>
    </div>
  );
};

export default Profile;
