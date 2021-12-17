import User, { UserInterface } from "../models/User";
import Post, { PostInterface } from "../models/Post";
import mongoose from "mongoose";

// This function populates mongodb-memory-server for testing.
// Note: Database should be dropped in a beforeEach() in test file before calling this function.

export default async function populateMockDatabase() {
  const mockUsers: UserInterface[] = [
    {
      email: "george@clooney.com",
      firstName: "George",
      lastName: "Clooney",
    },
    {
      email: "emma@stone.com",
      firstName: "Emma",
      lastName: "Stone",
    },
    {
      email: "brad@pitt.com",
      firstName: "Brad",
      lastName: "Pitt",
    },
    {
      email: "angelina@jolie.com",
      firstName: "Angelina",
      lastName: "Jolie",
    },
  ];

  await User.insertMany(mockUsers);

  const users = await User.find({});
  const mockUserIds: string[] = users.map((objId) => objId.id);

  const mockPosts: PostInterface[] = [
    {
      author: mockUserIds[0],
      content: "george - 1",
      comments: [],
    },
    {
      author: mockUserIds[0],
      content: "george - 2",
      comments: [],
    },
    {
      author: mockUserIds[0],
      content: "george - 3",
      comments: [],
    },
    {
      author: mockUserIds[0],
      content: "george - 4",
      comments: [],
    },
  ];

  await Post.insertMany(mockPosts);

  // make george and emma friends
  const george = await User.findById(mockUserIds[0]);
  const emma = await User.findById(mockUserIds[1]);
  emma?.friends?.push(mockUserIds[0]);
  george?.friends?.push(mockUserIds[1]);
  emma?.save();
  george?.save();

  return mockUserIds;
}
