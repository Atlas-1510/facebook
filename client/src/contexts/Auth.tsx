import { createContext, FC, ReactNode, useState, useEffect } from "react";
import axios from "axios";
import { useQueryClient, useQuery, useMutation } from "react-query";

export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  friends: string[];
  inboundFriendRequests: string[];
  outboundFriendRequests: string[];
  googleId?: string;
  thumbnail?: string;
}

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
