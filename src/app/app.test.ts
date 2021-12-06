import makeApp from "./app";
import request from "supertest";
import { jest } from "@jest/globals";

const getUser = jest.fn();

const app = makeApp({
  getUser,
});

describe("GET /users", () => {
  beforeEach(() => {
    getUser.mockReset();
  });
  describe("given a uid", () => {
    test("make a request to database to get the user information", async () => {
      const response = await request(app).get("/users/1234");
      expect(getUser.mock.calls.length).toBe(1);
      expect(getUser.mock.calls[0][0]).toBe("1234");
    });
  });
});
