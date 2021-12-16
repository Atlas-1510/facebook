import { getNewsfeedPosts } from "./discord";
import { getMockReq, getMockRes } from "@jest-mock/express";
import Post from "../../models/Post";
import User from "../../models/User";
import mongoose from "mongoose";

jest.mock("../../models/Post");
jest.mock("../../models/User");

describe("getNewsfeedPosts", () => {
  let req: any, res: any, next: any;
  beforeAll(() => {
    // userQueryBuilder and postQueryBuilder are mocks of how the mongoose 'Model.find()' query system works with chaining.
    // i.e can use to mock something like this: Post.findById('...').where('...').in('...').sort('...').exec()
    const userFindQueryBuilder: any = {
      select: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      in: jest.fn().mockReturnThis(),
      exec: jest.fn(), // exec() should be called at the end of a query, so no chaining after this.
    };

    const postFindQueryBuilder: any = {
      select: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      in: jest.fn().mockReturnThis(),
      exec: jest.fn(),
    };

    const userFindByIdQueryBuilder: any = {
      select: jest.fn().mockReturnThis(),
      exec: jest.fn(),
    };

    //@ts-ignore
    Post.find.mockImplementation(() => {
      return postFindQueryBuilder;
    });
    //@ts-ignore
    User.find.mockImplementation(() => {
      return userFindQueryBuilder;
    });

    //@ts-ignore
    User.findById.mockImplementation(() => {
      return userFindByIdQueryBuilder;
    });
  });
  beforeEach(() => {
    jest.clearAllMocks();
    res = getMockRes().res;
    next = getMockRes().next;
  });

  test("looks up user friends, and returns relevant posts", async () => {
    const mockUser = {
      friends: ["friend1", "friend2"],
    };
    const mockPosts = ["post 1", "post 2"];
    const mockUID = new mongoose.Types.ObjectId();
    req = getMockReq({ params: { uid: mockUID } });
    //@ts-ignore
    User.findById().select().exec.mockReturnValue(mockUser);
    //@ts-ignore
    Post.find().where().in().exec.mockReturnValue(mockPosts);
    await getNewsfeedPosts(req, res, next);
    //@ts-ignore
    expect(User.findById).toHaveBeenCalledWith(mockUID);
    //@ts-ignore
    expect(Post.find().where().in).toHaveBeenCalledWith(["friend1", "friend2"]);
    expect(res.send).toHaveBeenCalledWith(mockPosts);
  });
});
