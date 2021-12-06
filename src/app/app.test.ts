import makeApp from "./app";
import request from "supertest";
import { jest } from "@jest/globals";

const readUser = jest.fn();

const app = makeApp({
  readUser,
});

describe("GET /users", () => {
  beforeEach(() => {
    readUser.mockReset();
  });
  describe("given a uid", () => {
    test("make a request to database to get the user information", async () => {
      const response = await request(app).get("/users/1234");
      expect(readUser.mock.calls.length).toBe(1);
      expect(readUser.mock.calls[0][0]).toBe("1234");
    });
  });
});
