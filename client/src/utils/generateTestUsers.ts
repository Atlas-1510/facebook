// import mongoose from "mongoose";
import { User } from "../contexts/Auth";

export default function generateTestUsers() {
  const mockUserIDs = [`123`, `456`, `789`, `abc`, `def`];

  // mockUsers designed from the view point of Tony (2nd element in array).
  const mockUsers: User[] = [
    {
      _id: mockUserIDs[0],
      email: "steve@rogers.com",
      firstName: "Steve",
      lastName: "Rogers",
      inboundFriendRequests: [],
      outboundFriendRequests: [],
      get fullName() {
        return this.firstName + " " + this.lastName;
      },
      friends: [],
    },
    {
      _id: mockUserIDs[1],
      email: "tony@stark.com",
      firstName: "Tony",
      lastName: "Stark",
      inboundFriendRequests: [mockUserIDs[2]],
      outboundFriendRequests: [mockUserIDs[4]],
      get fullName() {
        return this.firstName + " " + this.lastName;
      },
      friends: [mockUserIDs[3]],
    },
    {
      _id: mockUserIDs[2],
      email: "peter@parker.com",
      firstName: "Peter",
      lastName: "Parker",
      inboundFriendRequests: [],
      outboundFriendRequests: [mockUserIDs[1]],
      get fullName() {
        return this.firstName + " " + this.lastName;
      },
      friends: [],
    },
    {
      _id: mockUserIDs[3],
      email: "bruce@banner.com",
      firstName: "Bruce",
      lastName: "Banner",
      inboundFriendRequests: [],
      outboundFriendRequests: [],
      get fullName() {
        return this.firstName + " " + this.lastName;
      },
      friends: [mockUserIDs[1]],
    },
    {
      _id: mockUserIDs[4],
      email: "natasha@romanov.com",
      firstName: "Natasha",
      lastName: "Romanov",
      inboundFriendRequests: [mockUserIDs[1]],
      outboundFriendRequests: [],
      get fullName() {
        return this.firstName + " " + this.lastName;
      },
      friends: [],
    },
  ];

  return mockUsers;
}
