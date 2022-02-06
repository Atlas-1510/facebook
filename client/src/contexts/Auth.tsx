import { createContext, FC, ReactNode } from "react";
import axios from "axios";
import { useQueryClient, useQuery } from "react-query";

export type AuthContextType = {
  user: any;
  getUserState: any;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  getUserState: null,
});

const { Provider } = AuthContext;

type Props = {
  children?: ReactNode;
};

const AuthProvider: FC<Props> = ({ children }) => {
  const fetchUserState = async () => {
    try {
      const response = await axios.get("/auth/getAuthStatus");
      return response.data;
    } catch (err: any) {
      console.log(err.response.data);
      throw err;
    }
  };

  const queryClient = useQueryClient();
  const { data: user, refetch: getUserState } = useQuery(
    "userState",
    fetchUserState
  );

  return <Provider value={{ user, getUserState }}>{children}</Provider>;
};

export { AuthContext, AuthProvider };
