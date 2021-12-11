import { getAllUsers, createNewUser, getUser } from "./users";
import { getMockReq, getMockRes } from "@jest-mock/express";
import User from "../../models/User";
import mongoose from "mongoose";

// Note: To set mock return values of spies below, needed to disable typescript checking using '@ts-ignore'

jest.spyOn(User, "find");
jest.spyOn(User, "findById");
jest.spyOn(User, "create");
jest.spyOn(mongoose, "isValidObjectId");

describe("usersController", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  describe("getAllUsers", () => {
    test("makes read request to database", async () => {
      // @ts-ignore
      User.find.mockResolvedValueOnce("some result");
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
        // @ts-ignore
        User.create.mockReturnValue(testUser);
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
        // @ts-ignore
        User.create.mockImplementation(() => {
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

  describe("getUser", () => {
    describe("given invalid input", () => {
      let req: any, res: any, next: any;
      beforeEach(() => {
        // @ts-ignore
        mongoose.isValidObjectId.mockReturnValue(false);
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
        // @ts-ignore
        mongoose.isValidObjectId.mockReturnValue(true);
        // @ts-ignore
        User.findById.mockReturnValue("some result");

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
        expect(res.send).toHaveBeenCalledWith("some result");
      });
      describe("if no user found in db to match valid uid query", () => {
        test("returns error with 404 status code", async () => {
          // @ts-ignore
          User.findById.mockReturnValue(null);
          await getUser(req, res, next);
          const err = next.mock.calls[0][0];
          expect(err).toBeInstanceOf(Error);
          expect(err.statusCode).toBe(404);
        });
      });
    });
  });
});
