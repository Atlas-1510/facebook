import app from "../../app/app";
import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import loadTestUsers from "../../utils/loadTestUsers";
import expectErrorCode from "../../utils/expectErrorCode";

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
  describe("GET", () => {
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
  });
  describe("POST", () => {
    describe("given valid input for a new user", () => {
      test("saves and returns the new user document", async () => {
        const response = await request(app).post("/api/users").send({
          firstName: "Wanda",
          lastName: "Maximoff",
        });
        expect(response.statusCode).toBe(201);
        expect(response.headers["content-type"]).toEqual(
          expect.stringContaining("json")
        );
        expect(response.body.firstName).toBe("Wanda");
      });
    });
  });
  describe("PUT", () => {
    expectErrorCode("returns 404 for invalid route", "put", "/api/users", 404);
  });
  describe("DELETE", () => {
    expectErrorCode(
      "returns 404 for invalid route",
      "delete",
      "/api/users",
      404
    );
  });
  describe("/:uid", () => {
    describe("GET", () => {
      describe("if uid invalid", () => {
        test("should respond with 400 status code", async () => {
          const response = await request(app).get("/api/users/INVALID_UID");
          expect(response.statusCode).toBe(400);
        });
      });
      describe("given a valid uid", () => {
        describe("if user exists in database", () => {
          test("should respond with a json object containing user information", async () => {
            const response = await request(app).get(
              `/api/users/${testUserIds[0]}`
            );
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
        describe("if user does not exist in database", () => {
          const nonExistingUserDocId = new mongoose.Types.ObjectId();

          expectErrorCode(
            "returns 404 for user not found",
            "get",
            `/api/users/${nonExistingUserDocId}`,
            404
          );
        });
      });
    });
    describe("POST", () => {
      expectErrorCode(
        "returns 404 for invalid route",
        "post",
        "/api/users/1234",
        404
      );
    });

    describe("PUT", () => {
      describe("if uid invalid", () => {
        expectErrorCode(
          "returns 400 for invalid route",
          "put",
          "/api/users/INVALID_UID",
          400
        );
      });
      describe("given a valid uid", () => {
        test("updates and returns user document if uid is found", async () => {
          const response = await request(app)
            .put(`/api/users/${testUserIds[0]}`)
            .send({
              firstName: "Sam",
              lastName: "Wilson",
            });
          expect(response.statusCode).toBe(200);
          expect(response.headers["content-type"]).toEqual(
            expect.stringContaining("json")
          );
          expect(response.body).toEqual({
            _id: `${testUserIds[0]}`,
            firstName: "Sam",
            lastName: "Wilson",
            __v: 0,
          });
        });
      });
    });
  });
});
