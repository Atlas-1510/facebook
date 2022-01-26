import { createContext, FC, ReactNode, useState, useEffect } from "react";
import axios from "axios";

export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  friends?: string[];
  inboundFriendRequests?: string[];
  outboundFriendRequests?: string[];
  googleId?: string;
  thumbnail?: string;
}

type AuthContextType = {
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
      console.log("api call made");
      const response = await axios.get("/auth/getAuthStatus");
      console.log(response.data);
      setUser(response.data);
    }
    getAuthStatus();
  }, []);

  return <Provider value={{ user, setUser }}>{children}</Provider>;
};

export { AuthContext, AuthProvider };
