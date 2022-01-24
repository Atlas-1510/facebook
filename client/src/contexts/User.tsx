import { createContext } from "react";
export const UserContext = createContext<User | null>(null);

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
