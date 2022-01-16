import { getNewsfeedPosts } from "../posts";
import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import populateMockDatabase from "../../../utils/populateMockDatabase";
import generateTestApp from "../../../utils/generateTestApp";
import Post from "../../../models/Post";

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
