import User, { UserInterface } from "../models/User";
import Post, { PostInterface } from "../models/Post";
import Comment, { CommentInterface } from "../models/Comment";
import { HydratedDocument, Types } from "mongoose";
const debug = require("debug")("facebook:utils/populateMockDatabase");

// This function populates mongodb-memory-server for testing.
// Note: Database should be dropped in a beforeEach() in test file before calling this function.

export default async function populateMockDatabase() {
  // ***** USERS *****

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

  // make steve and tony friends
  const steve = await User.findById(mockUserIds[0]);
  const tony = await User.findById(mockUserIds[1]);
  steve?.friends?.push(mockUserIds[1]);
  tony?.friends?.push(mockUserIds[0]);
  steve?.save();
  tony?.save();

  // ***** POSTS *****

  const mockPosts: PostInterface[] = [
    {
      author: mockUserIds[0],
      content: "1st post by Steve",
      comments: new Types.DocumentArray([]),
      likes: [users[0]._id],
    },
    {
      author: mockUserIds[1],
      content: "1st post by Tony",
      comments: new Types.DocumentArray([]),
      likes: [],
    },
    {
      author: mockUserIds[0],
      content: "2nd post by Steve",
      comments: new Types.DocumentArray([]),
      likes: [],
    },
    {
      author: mockUserIds[2],
      content: "1st post by Peter",
      comments: new Types.DocumentArray([]),
      likes: [],
    },
  ];

  await Post.insertMany(mockPosts);

  const posts = await Post.find({});
  const mockPostIds: string[] = posts.map((objId) => objId.id);

  // ***** COMMENTS *****

  const mockComments: HydratedDocument<CommentInterface>[] = [
    new Comment({
      author: mockUserIds[0],
      content: "1st comment - author[0] - post[0]",
      postID: mockPostIds[0],
    }),
    new Comment({
      author: mockUserIds[1],
      content: "2nd comment - author[1] - post[0]",
      postID: mockPostIds[0],
    }),
    new Comment({
      author: mockUserIds[2],
      content: "3rd comment - author[2] - post[0]",
      postID: mockPostIds[0],
    }),
  ];

  const mockCommentIds = [];

  for (const comment of mockComments) {
    mockCommentIds.push(comment.id);
    let post = await Post.findById(comment.postID);
    post?.comments.push(comment);
    await post?.save();
  }

  return { mockUserIds, mockPostIds, mockCommentIds };
}
