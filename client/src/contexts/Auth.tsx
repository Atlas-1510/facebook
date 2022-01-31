import { createContext, FC, ReactNode, useState, useEffect } from "react";
import axios from "axios";

export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  friends?: string[];
  inboundFriendRequests?: string[];
  outboundFriendRequests?: string[];
  googleId?: string;
  thumbnail?: string;
}

export type AuthContextType = {
  user: User | null;
  setUser: any;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: null,
});

const { Provider } = AuthContext;

type Props = {
  children?: ReactNode;
};

const AuthProvider: FC<Props> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function getAuthStatus() {
      const response = await axios.get("/auth/getAuthStatus");

      setUser(response.data);
    }
    getAuthStatus();
  }, []);

  return <Provider value={{ user, setUser }}>{children}</Provider>;
};

export { AuthContext, AuthProvider };
