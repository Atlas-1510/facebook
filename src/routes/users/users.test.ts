import app from "../../app/app";
import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import loadTestUsers from "../../utils/loadTestUsers";

describe("/api/users", () => {
  let mongoServer: MongoMemoryServer;
  let testUserIds: string[];
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });
  beforeEach(async () => {
    testUserIds = await loadTestUsers();
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
  describe("/:uid - GET", () => {
    describe("if uid invalid", () => {
      test("should respond with 400 status code", async () => {
        const response = await request(app).get("/api/users/INVALID_UID");
        expect(response.statusCode).toBe(400);
      });
    });
    describe("given a valid uid", () => {
      test("should respond with a json object containing user information", async () => {
        const response = await request(app).get(`/api/users/${testUserIds[0]}`);
        expect(response.statusCode).toBe(200);
        expect(response.headers["content-type"]).toEqual(
          expect.stringContaining("json")
        );
        expect(response.body).toEqual({
          _id: `${testUserIds[0]}`,
          firstName: "Steve",
          lastName: "Rogers",
          __v: 0,
        });
      });
    });
  });

  describe("/:uid - POST", () => {
    describe("if uid invalid", () => {
      test("should respond with 400 status code", async () => {
        const response = await request(app).post("/api/users/INVALID_UID");
        expect(response.statusCode).toBe(400);
      });
    });
    describe("given a valid uid", () => {
      test("returns status 404 if uid is for non-existant user", async () => {
        const testId = new mongoose.Types.ObjectId();
        const response = await request(app).post(`/api/users/${testId}`);
        expect(response.statusCode).toBe(404);
      });
      test("updates and returns user document if uid is found", () => {});
    });
  });
});
