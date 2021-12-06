import makeApp from "./app";
import request from "supertest";
import { jest } from "@jest/globals";

const readUser: any = jest.fn();

const app = makeApp({
  readUser,
});

describe("GET /users", () => {
  beforeEach(() => {
    readUser.mockReset();
  });
  describe("given a userId", () => {
    test("should make a request to database to get the user information", async () => {
      await request(app).get("/users/1234");
      expect(readUser.mock.calls.length).toBe(1);
      expect(readUser.mock.calls[0][0]).toBe("1234");
    });

    test("should respond with a status code of 200", async () => {
      const response = await request(app).get("/users/1234");
      expect(response.statusCode).toBe(200);
    });

    test("should respond with a json object containing the user id", async () => {
      for (let i = 0; i < 10; i++) {
        readUser.mockReset();
        readUser.mockResolvedValue({
          userId: i,
        });
        const response = await request(app).get(`/users/${i}`);
        expect(response.body.userId).toBe(i);
      }
    });
  });
  describe("if userId missing", () => {
    test("should respond with a status code of 400, without interacting with database", async () => {
      expect(readUser.mock.calls.length).toBe(0);
      const response = await request(app).get("/users");
      expect(response.statusCode).toBe(400);
    });
  });
});
