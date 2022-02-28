import { FC, useContext, useEffect } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "react-query";
import axios from "axios";
import { AuthContext } from "../../contexts/Auth";
import ProfileHeader from "../../components/ProfileHeader";

const ForeignProfile: FC = () => {
  const navigate = useNavigate();
  const { uid: id } = useParams();
  const { user: currentUser } = useContext(AuthContext);

  useEffect(() => {
    if (id === currentUser?._id) {
      navigate("/profile", { replace: true });
    }
  }, [currentUser, id, navigate]);

  const getUser = async () => {
    try {
      const response = await axios.get(`/api/users/${id}`);
      return response.data;
    } catch (err: any) {
      console.log(err.response.data);
      throw err;
    }
  };

  const { isLoading, isError, data: user } = useQuery(`user ${id}`, getUser);

  if (isLoading) {
    return <div>Loading</div>;
  }
  if (isError) {
    return <div>Error</div>;
  } else {
    return (
      <div className="  min-h-screen relative -top-5">
        <ProfileHeader user={user} mainURL={`/users/${user!._id}`} />
        <main className=" flex justify-center flex-grow mt-3">
          <div className="grid grid-cols-5 w-full md:w-[60vw] gap-3">
            <Outlet context={{ user: user }} />
          </div>
        </main>
      </div>
    );
  }
};

export default ForeignProfile;
