import User, { UserInput, UserDocument } from "../models/User";
import Post, { PostInput, PostDocument } from "../models/Post";
import Comment, { CommentInput, CommentDocument } from "../models/Comment";
import { HydratedDocument, Types } from "mongoose";
import bcrypt from "bcryptjs";
const debug = require("debug")("facebook:utils/populateMockDatabase");

// This function populates mongodb-memory-server for testing.
// Note: Database should be dropped in a beforeEach() in test file before calling this function.

export default async function populateMockDatabase() {
  // ***** USERS *****

  const mockUsers: UserInput[] = [
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

  await Promise.all(
    mockUsers.map(async (user) => {
      user.password = await bcrypt.hash("test", 10);
    })
  );

  const users: UserDocument[] = await User.insertMany(mockUsers);

  // make steve and tony friends
  users[0].friends?.push(users[1]._id);
  users[1].friends?.push(users[0]._id);
  users[0].save();
  // tony (users[1]) is saved below

  // bruce has an unaccepted friend request from tony
  users[3].inboundFriendRequests?.push(users[1]._id);
  users[1].outboundFriendRequests?.push(users[3]._id);
  users[3].save();
  users[1].save();

  // ***** POSTS *****

  const mockPosts: PostInput[] = [
    {
      author: users[0]._id,
      content: "1st post by Steve",
      comments: [],
      likes: [users[0]._id],
    },
    {
      author: users[1]._id,
      content: "1st post by Tony",
      comments: [],
      likes: [],
    },
    {
      author: users[0]._id,
      content: "2nd post by Steve",
      comments: [],
      likes: [],
    },
    {
      author: users[2]._id,
      content: "1st post by Peter",
      comments: [],
      likes: [],
    },
  ];

  const posts: PostDocument[] = await Post.insertMany(mockPosts);

  // ***** COMMENTS *****

  const comments: HydratedDocument<CommentDocument>[] = [
    new Comment({
      author: users[0]._id,
      content: "1st comment - author[0] - post[0]",
      postID: posts[0]._id,
    }),
    new Comment({
      author: users[1]._id,
      content: "2nd comment - author[1] - post[0]",
      postID: posts[0]._id,
    }),
    new Comment({
      author: users[2]._id,
      content: "3rd comment - author[2] - post[0]",
      postID: posts[0]._id,
    }),
  ];

  for (const comment of comments) {
    let post = await Post.findById(comment.postID);
    post?.comments.push(comment);
    await post?.save();
  }

  return { users, posts, comments };
}
