import { getAllUsers, createNewUser, getUser } from "./users";
import { getMockReq, getMockRes } from "@jest-mock/express";
import User from "../../models/User";
import mongoose from "mongoose";

const isValidObjectIdMock = jest.spyOn(mongoose, "isValidObjectId");

const UserFindMock = jest.spyOn(User, "find");
const UserCreateMock = jest.spyOn(User, "create");
const UserFind = jest.fn();
const UserCreate = jest.fn();
const isValidObjectId = jest.fn();

jest.mock("../../models/User");

describe("usersController", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    UserFindMock.mockImplementation(UserFind);
    UserCreateMock.mockImplementation(UserCreate);
  });
  describe("getAllUsers", () => {
    test("makes read request to database", async () => {
      UserFind.mockReturnValue("some result");
      const req = getMockReq();
      const { res, next } = getMockRes();
      await getAllUsers(req, res, next);
      expect(User.find).toHaveBeenCalledTimes(1);
      expect(User.find).toHaveBeenCalledWith();
      expect(res.send).toHaveBeenCalledWith("some result");
    });
  });

  describe("createNewUser", () => {
    describe("given valid input", () => {
      let req: any, res: any, next: any;
      const testUser = {
        email: "kate@bishop.com",
        firstName: "Kate",
        lastName: "Bishop",
      };

      beforeEach(() => {
        req = getMockReq({
          body: testUser,
        });
        UserCreate.mockReturnValue(testUser);
        res = getMockRes().res;
        next = getMockRes().next;
      });

      test("makes create request to database", async () => {
        await createNewUser(req, res, next);
        expect(User.create).toHaveBeenCalledTimes(1);
      });
      test("returns new user document", async () => {
        await createNewUser(req, res, next);
        expect(res.send).toHaveBeenCalledWith(testUser);
      });
      test("returns 201 status code", async () => {
        await createNewUser(req, res, next);
        expect(res.status).toHaveBeenCalledWith(201);
      });
    });
    describe("given invalid input", () => {
      let req: any, res: any, next: any;
      const mockError = new Error("Invalid input");
      beforeEach(() => {
        req = getMockReq();
        UserCreate.mockImplementation(() => {
          throw mockError;
        });
        res = getMockRes().res;
        next = getMockRes().next;
      });
      test("calls next() with error object", async () => {
        await createNewUser(req, res, next);
        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith(mockError);
      });
    });
  });
});
describe("getUser", () => {
  describe("given invalid input", () => {
    let req: any, res: any, next: any;
    beforeEach(() => {
      jest.resetAllMocks();
      isValidObjectIdMock.mockImplementation(isValidObjectId);
      isValidObjectId.mockReturnValue(false);
      req = getMockReq({
        params: {
          uid: "invalid UID",
        },
      });
      res = getMockRes().res;
      next = getMockRes().next;
    });
    test("returns error with 400 status code", async () => {
      await getUser(req, res, next);
      expect(next).toHaveBeenCalledTimes(1);
      const err = next.mock.calls[0][0];
      expect(err).toBeInstanceOf(Error);
      expect(err.statusCode).toBe(400);
    });
  });
  describe("given valid input", () => {
    let req: any, res: any, next: any;
    beforeEach(() => {
      jest.resetAllMocks();
      isValidObjectIdMock.mockImplementation(isValidObjectId);
      isValidObjectId.mockReturnValue(true);
      UserFindMock.mockImplementation(UserFind);
      req = getMockReq({
        params: {
          uid: "valid UID",
        },
      });
      res = getMockRes().res;
      next = getMockRes().next;
    });
    test("makes get request to database", async () => {
      await getUser(req, res, next);
      expect(true).toBe(true);
      // Have successfully mocked mongoose.isValidObjectId to set true/false in tests.
      // Now, want to streamline User mocks so don't need to manually spyOn and mock each function.
    });
  });
});
