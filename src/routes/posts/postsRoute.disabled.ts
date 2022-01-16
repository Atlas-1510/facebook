import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import loadMockUsersAndPosts from "../../utils/populateMockDatabase";
import expectErrorCode from "../../utils/expectErrorCode";
import app from "../../app/app";
import Post from "../../models/Post";
import User from "../../models/User";

describe("/api/posts", () => {
  let mongoServer: MongoMemoryServer;
  let mockUserIds: string[];
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });
  beforeEach(async () => {
    mockUserIds = await loadMockUsersAndPosts();
  });
  afterAll(async () => {
    if (mongoose.connection.db) {
      await mongoose.connection.close();
    }
    if (mongoServer) {
      await mongoServer.stop();
    }
  });
  describe("/newsfeed/:uid", () => {
    describe("GET", () => {
      test("given a user id, return posts from friends of that user", async () => {
        const results = await request(app).get(
          `/api/posts/newsfeed/${mockUserIds[1]}`
        );
        expect(results.body).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ content: "george - 1" }),
            expect.objectContaining({ content: "george - 2" }),
            expect.objectContaining({ content: "george - 3" }),
            expect.objectContaining({ content: "george - 4" }),
          ])
        );
      });
    });
  });
});
