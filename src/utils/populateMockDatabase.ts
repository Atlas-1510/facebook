import User, { UserInterface } from "../models/User";
import Post, { PostInterface } from "../models/Post";

// This function populates mongodb-memory-server for testing.
// Note: Database should be dropped in a beforeEach() in test file before calling this function.

export default async function populateMockDatabase() {
  const mockUsers: UserInterface[] = [
    {
      email: "steve@rogers.com",
      firstName: "Steve",
      lastName: "Rogers",
    },
    {
      email: "tony@stark.com",
      firstName: "Tony",
      lastName: "Stark",
    },
    {
      email: "peter@parker.com",
      firstName: "Peter",
      lastName: "Parker",
    },
    {
      email: "bruce@banner.com",
      firstName: "Bruce",
      lastName: "Banner",
    },
  ];

  await User.insertMany(mockUsers);

  const users = await User.find({});
  const mockUserIds: string[] = users.map((objId) => objId.id);

  const mockPosts: PostInterface[] = [
    {
      author: mockUserIds[0],
      content: "1st post by Steve",
      comments: [],
    },
    {
      author: mockUserIds[1],
      content: "1st post by Tony",
      comments: [],
    },
    {
      author: mockUserIds[0],
      content: "2nd post by Steve",
      comments: [],
    },
    {
      author: mockUserIds[2],
      content: "1st post by Peter",
      comments: [],
    },
  ];

  await Post.insertMany(mockPosts);

  const posts = await Post.find({});
  const mockPostIds: string[] = posts.map((objId) => objId.id);

  // make steve and tony friends
  const steve = await User.findById(mockUserIds[0]);
  const tony = await User.findById(mockUserIds[1]);
  steve?.friends?.push(mockUserIds[1]);
  tony?.friends?.push(mockUserIds[0]);
  steve?.save();
  tony?.save();

  return { mockUserIds, mockPostIds };
}
