import app from "../../app/app";
import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import loadTestUsers from "../../utils/loadTestUsers";
import loadSingleTestUser from "../../utils/loadSingleTestUser";

describe("/api/users", () => {
  let mongoServer: MongoMemoryServer;
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
    const response = await request(app).get("/api/users");
    expect(response.body.length).toBe(4);
    expect(response.body[0].firstName).toBe("Steve");
  });
  test("should respond with a status code of 200", async () => {
    const response = await request(app).get("/api/users");
    expect(response.statusCode).toBe(200);
  });
  test("should specify json in the content type header", async () => {
    const response = await request(app).get("/api/users");
    expect(response.headers["content-type"]).toEqual(
      expect.stringContaining("json")
    );
  });
  describe("/:uid", () => {
    describe("if uid invalid", () => {
      test("should respond with 400 status code", async () => {
        const response = await request(app).get("/api/users/INVALID_UID");
        expect(response.statusCode).toBe(400);
      });
    });
    describe("given a uid", () => {
      test("should respond with a json object containing user information", async () => {
        const uid = await loadSingleTestUser();
        const response = await request(app).get(`/api/users/${uid}`);
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
