import loadApp from "../utils/loadApp";
import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import loadTestUsers from "../utils/loadTestUsers";
import loadSingleTestUser from "../utils/loadSingleTestUser";

describe("/users", () => {
  let mongoServer: MongoMemoryServer;
  const app = loadApp();

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });

  beforeEach(async () => {
    await loadTestUsers();
  });

  afterAll(async () => {
    if (mongoose.connection.db) {
      await mongoose.connection.close();
    }
    if (mongoServer) {
      await mongoServer.stop();
    }
  });

  test("returns test users from database", async () => {
    const response = await request(app).get("/users");
    expect(response.body.length).toBe(4);
    expect(response.body[0].firstName).toBe("Steve");
  });

  test("should respond with a status code of 200", async () => {
    const response = await request(app).get("/users");
    expect(response.statusCode).toBe(200);
  });

  test("should specify json in the content type header", async () => {
    const response = await request(app).get("/users");
    expect(response.headers["content-type"]).toEqual(
      expect.stringContaining("json")
    );
  });

  describe("/users/:uid", () => {
    describe("given a uid", () => {
      test("should respond with a json object containing user information", async () => {
        const uid = await loadSingleTestUser();
        const response = await request(app).get(`/users/${uid}`);
        expect(response.statusCode).toBe(200);
        expect(response.headers["content-type"]).toEqual(
          expect.stringContaining("json")
        );
        expect(response.body).toEqual({
          _id: `${uid}`,
          firstName: "Test",
          lastName: "McTest",
          __v: 0,
        });
      });
    });
  });
});

// const readUser: any = jest.fn();

// const app = makeApp({
//   readUser,
// });

// describe("GET /users", () => {
//   beforeEach(() => {
//     readUser.mockReset();
//   });
//   describe("given a userId", () => {
//     test("should make a request to database to get the user information", async () => {
//       await request(app).get("/users/1234");
//       expect(readUser.mock.calls.length).toBe(1);
//       expect(readUser.mock.calls[0][0]).toBe("1234");
//     });

//
//   });
//   describe("if userId missing", () => {
//     test("should respond with a status code of 400, without interacting with database", async () => {
//       expect(readUser.mock.calls.length).toBe(0);
//       const response = await request(app).get("/users");
//       expect(response.statusCode).toBe(400);
//     });
//   });
// })
