import { FC } from "react";
import { useParams } from "react-router-dom";

const Users: FC = () => {
  const { pid } = useParams();
  return <div>This is the POST page. Post ID is {pid}</div>;
};

export default Users;
