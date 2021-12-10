import { getAllUsers, createNewUser } from "./users";
import { getMockReq, getMockRes } from "@jest-mock/express";
import User from "../../models/User";

const UserFindMock = jest.spyOn(User, "find");
const UserCreateMock = jest.spyOn(User, "create");
const UserFind = jest.fn();
const UserCreate = jest.fn();

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
      const { res, next, clearMockRes } = getMockRes();
      await getAllUsers(req, res, next);
      expect(User.find).toHaveBeenCalledTimes(1);
      expect(User.find).toHaveBeenCalledWith();
      expect(res.send).toHaveBeenCalledWith("some result");
    });
  });
  describe("createNewUser", () => {
    describe("given valid input", () => {
      test("makes create request to database", async () => {
        const req = getMockReq();
        const { res, next } = getMockRes();
        await createNewUser(req, res, next);
        expect(User.create).toHaveBeenCalledTimes(1);
      });
      test("returns new user document", async () => {
        const testUser = {
          email: "kate@bishop.com",
          firstName: "Kate",
          lastName: "Bishop",
        };
        UserCreate.mockReturnValue(testUser);
        const req = getMockReq({
          body: testUser,
        });
        const { res, next } = getMockRes();
        await createNewUser(req, res, next);
        expect(res.send).toHaveBeenCalledWith(testUser);
      });
      test("returns 201 status code", async () => {
        const req = getMockReq();
        const { res, next } = getMockRes();
        await createNewUser(req, res, next);
        expect(res.status).toHaveBeenCalledWith(201);
      });
    });
  });
});
