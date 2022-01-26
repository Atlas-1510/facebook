import { FC, useContext } from "react";
import { AuthContext } from "../contexts/Auth";
import { Link } from "react-router-dom";

const Profile: FC = () => {
  const { user } = useContext(AuthContext);

  return (
    <div>
      <div>This is the profile page</div>
      <div>Current user is {user?.firstName}</div>
      <Link to="/">Home</Link>
    </div>
  );
};

export default Profile;
