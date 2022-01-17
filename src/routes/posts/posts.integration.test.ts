import request, { agent } from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import populateMockDatabase from "../../utils/populateMockDatabase";
import app from "../../app/app";

describe("/api/posts", () => {
  let mongoServer: MongoMemoryServer;
  let mockUserIds: string[];
  let agent: any;
  agent = request.agent(app);
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });
  beforeEach(async () => {
    mongoose.connection.dropDatabase();
    ({ mockUserIds } = await populateMockDatabase());
  });
  afterAll(async () => {
    if (mongoose.connection.db) {
      await mongoose.connection.close();
    }
    if (mongoServer) {
      await mongoServer.stop();
    }
  });
  describe("/newsfeed", () => {
    describe("if not logged in", () => {
      describe("GET", () => {
        test("asks client to login and retry", async () => {
          const response = await agent.get("/api/posts/newsfeed");
          expect(response.body).toMatchObject({
            message: "Please login to view this",
          });
        });
      });
    });
    describe("if logged in", () => {
      beforeEach(async () => {
        await agent
          .post("/login")
          .send({
            email: "steve@rogers.com",
            password: 12345,
          })
          .type("form");
      });
      describe("GET", () => {
        test("returns newsfeed posts for logged in user", async () => {
          const response = await agent.get("/api/posts/newsfeed");
          expect(response.body.length).toBe(3);
          // Steve and Peter are not friends (see populateMockDatabase)
          expect(response.body).not.toContainEqual(
            expect.objectContaining({
              content: "1st post by Peter",
            })
          );
        });
      });
    });
  });
});
