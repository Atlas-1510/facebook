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
  displayPhoto?: string;
  bio?: string;
}
