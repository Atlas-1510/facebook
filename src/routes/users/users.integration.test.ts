import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import loadMockUsers from "./loadMockUsers";
import expectErrorCode from "../../utils/expectErrorCode";
import app from "../../app/app";

describe("/api/users", () => {
  let mongoServer: MongoMemoryServer;
  let mockUserIds: string[];
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });
  beforeEach(async () => {
    mongoose.connection.dropDatabase();
    mockUserIds = await loadMockUsers();
  });
  afterAll(async () => {
    if (mongoose.connection.db) {
      await mongoose.connection.close();
    }
    if (mongoServer) {
      await mongoServer.stop();
    }
  });
  describe("if logged in", () => {
    let agent: any;
    beforeEach(async () => {
      agent = request.agent(app);
      await agent
        .post("/login")
        .send({
          email: "steve@rogers.com",
          password: 12345,
        })
        .type("form");
    });
    describe("GET", () => {
      test("returns test users from database", async () => {
        const result = await agent.get("/api/users");
        expect(result.body.length).toBe(4);
        expect(result.body[0].firstName).toBe("Steve");
      });
      test("should respond with a status code of 200", async () => {
        const response = await agent.get("/api/users");
        expect(response.statusCode).toBe(200);
      });
      test("should specify json in the content type header", async () => {
        const response = await agent.get("/api/users");
        expect(response.headers["content-type"]).toEqual(
          expect.stringContaining("json")
        );
      });
    });
    describe("POST", () => {
      describe("given valid input for a new user", () => {
        test("saves and returns the new user document", async () => {
          const response = await agent.post("/api/users").send({
            email: "wanda@maximoff.com",
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
      expectErrorCode(
        "returns 404 for invalid route",
        "put",
        "/api/users",
        404
      );
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
            const response = await agent.get("/api/users/INVALID_UID");
            expect(response.statusCode).toBe(400);
          });
        });
        describe("given a valid uid", () => {
          describe("if user exists in database", () => {
            test("should respond with a json object containing user information", async () => {
              const response = await agent.get(`/api/users/${mockUserIds[0]}`);
              expect(response.statusCode).toBe(200);
              expect(response.headers["content-type"]).toEqual(
                expect.stringContaining("json")
              );
              expect(response.body).toEqual({
                _id: `${mockUserIds[0]}`,
                email: "steve@rogers.com",
                firstName: "Steve",
                lastName: "Rogers",
                friends: [],
                __v: 0,
              });
            });
          });
          describe("if user does not exist in database", () => {
            const nonExistingUserDocId = new mongoose.Types.ObjectId();
            test("returns 404 for user not found", async () => {
              const response = await agent.get(
                `/api/users/${nonExistingUserDocId}`
              );
              expect(response.statusCode).toBe(404);
            });
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
          test("returns 400 for invalid route", async () => {
            const response = await agent.put("/api/users/INVALID_UID");
            expect(response.statusCode).toBe(400);
          });
        });
        describe("given a valid uid", () => {
          test("updates and returns user document if uid is found", async () => {
            const response = await agent
              .put(`/api/users/${mockUserIds[0]}`)
              .send({
                email: "sam@wilson.com",
                firstName: "Sam",
                lastName: "Wilson",
              });
            expect(response.statusCode).toBe(200);
            expect(response.headers["content-type"]).toEqual(
              expect.stringContaining("json")
            );
            expect(response.body).toEqual({
              _id: `${mockUserIds[0]}`,
              email: "sam@wilson.com",
              firstName: "Sam",
              lastName: "Wilson",
              friends: [],
              __v: 0,
            });
          });
        });
      });
    });
  });
});
