import { getNewsfeedPosts } from "../posts";
import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import populateMockDatabase from "../../../utils/populateMockDatabase";
import generateTestApp from "../../../utils/generateTestApp";

const app = generateTestApp("get", "/newsfeed/:uid", getNewsfeedPosts);

let mongoServer: MongoMemoryServer;
let mockUserIds: string[];
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});
beforeEach(async () => {
  mongoose.connection.dropDatabase();
  mockUserIds = await populateMockDatabase();
});
afterAll(async () => {
  if (mongoose.connection.db) {
    await mongoose.connection.close();
  }
  if (mongoServer) {
    await mongoServer.stop();
  }
});

describe("if invalid uid", () => {
  test("returns 400 status code error", async () => {
    const response = await request(app).get("/newsfeed/INVALID_UID");
    expect(response.body.errors.length).toBe(1);
    expect(response.statusCode).toBe(400);
  });
});

describe("if valid uid", () => {
  test("returns only own posts and posts by friends", async () => {
    const response = await request(app).get(`/newsfeed/${mockUserIds[0]}`);
    expect(response.body.length).toBe(3);
    // Steve and Peter are not friends (see populateMockDatabase)
    expect(response.body).not.toContainEqual(
      expect.objectContaining({
        content: "1st post by Peter",
      })
    );
  });
});
