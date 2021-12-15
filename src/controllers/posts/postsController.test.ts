import { getNewsfeedPosts } from "./posts";
import { getMockReq, getMockRes } from "@jest-mock/express";
import Post from "../../models/Post";
import User from "../../models/User";
import mongoose from "mongoose";

jest.mock("../../models/Post");
jest.mock("../../models/User");

Post.find = jest.fn();
User.find = jest.fn();

const generateQueryBuilder = () => {
  return {
    select: jest.fn().mockReturnThis(),
    sort: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    in: jest.fn().mockReturnThis(),
    exec: jest.fn().mockReturnThis(),
  };
};

//@ts-ignore
Post.find.mockImplementation(() => generateQueryBuilder());
//@ts-ignore
User.find.mockImplementation(() => generateQueryBuilder());

describe("postsController", () => {
  beforeAll(() => {
    Post.find = jest.fn();
    User.find = jest.fn();

    const userQueryBuilder: any = {
      select: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      in: jest.fn().mockReturnThis(),
      exec: jest.fn(),
    };

    const postQueryBuilder: any = {
      select: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      in: jest.fn().mockReturnThis(),
      exec: jest.fn(),
    };

    //@ts-ignore
    Post.find.mockImplementation(() => {
      return postQueryBuilder;
    });
    //@ts-ignore
    User.find.mockImplementation(() => {
      return userQueryBuilder;
    });
  });
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe("testing mocks", () => {
    test("testing User import", () => {
      // @ts-ignore
      User.find().select().sort().limit().exec("hello");
      // @ts-ignore
      expect(User.find().select().sort().limit().exec).toHaveBeenCalled();
      // @ts-ignore
      expect(User.find().select().sort().limit().exec).toHaveBeenCalledWith(
        "hello"
      );
      // @ts-ignore
      User.find().where().sort().exec.mockReturnValue("some value");
      // @ts-ignore
      const result = User.find().where().sort().exec();
      expect(result).toBe("some value");
      expect(User.find().in).not.toHaveBeenCalled();
    });

    test("testing Post import", () => {
      // @ts-ignore
      Post.find().select().sort().limit().exec("123");
      // @ts-ignore
      expect(Post.find().select().sort().limit().exec).toHaveBeenCalled();
      // @ts-ignore
      expect(Post.find().select().sort().limit().exec).toHaveBeenCalledWith(
        "123"
      );
      // @ts-ignore
      Post.find().where().sort().exec.mockReturnValue("abc");
      // @ts-ignore
      const result = Post.find().where().sort().exec();
      expect(result).toBe("abc");
    });
  });
  describe("postsController", () => {
    let req: any, res: any, next: any;
    beforeEach(() => {
      res = getMockRes().res;
      next = getMockRes().next;
    });
    describe("getNewsfeedPosts", () => {
      describe("if invalid uid", () => {
        test("returns 400 error and message asking for valid uid", async () => {
          req = getMockReq({ params: { uid: "invalid_uid" } });
          await getNewsfeedPosts(req, res, next);
          const err = next.mock.calls[0][0];
          expect(err).toBeInstanceOf(Error);
          expect(err.statusCode).toBe(400);
          expect(err.message).toBe("Provided UID is invalid");
        });
      });

      describe("if valid uid ", () => {
        test("looks up user friends, and returns relevant posts", async () => {
          const mockFriends = ["friend1", "friend2"];
          const mockPosts = ["post 1", "post 2"];
          const testUID = new mongoose.Types.ObjectId();
          req = getMockReq({ params: { uid: testUID } });
          //@ts-ignore
          User.find().select().exec.mockReturnValue(mockFriends);
          //@ts-ignore
          Post.find().where().in().exec.mockReturnValue(mockPosts);
          await getNewsfeedPosts(req, res, next);
          //@ts-ignore
          expect(User.find).toHaveBeenCalledWith(testUID);
          //@ts-ignore
          expect(Post.find().where().in).toHaveBeenCalledWith(mockFriends);
          expect(res.send).toHaveBeenCalledWith(mockPosts);
        });
      });
    });
  });
});
