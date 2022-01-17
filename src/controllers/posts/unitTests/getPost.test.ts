import { getPost } from "../posts";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import generateTestApp from "../../../utils/generateTestApp";
import populateMockDatabase from "../../../utils/populateMockDatabase";
import request from "supertest";

const app = generateTestApp("get", "/:pid", getPost);

let mongoServer: MongoMemoryServer;
let mockUserIds: string[];
let mockPostIds: string[];

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});
beforeEach(async () => {
  mongoose.connection.dropDatabase();
  ({ mockUserIds, mockPostIds } = await populateMockDatabase());
});
afterAll(async () => {
  if (mongoose.connection.db) {
    await mongoose.connection.close();
  }
  if (mongoServer) {
    await mongoServer.stop();
  }
});

describe("if invalid pid", () => {
  test("returns 400 error", async () => {
    const response = await request(app).get("/INVALID_PID");
    expect(response.body.errors.length).toBe(1);
    expect(response.statusCode).toBe(400);
  });
});

describe("if valid pid", () => {
  test("returns post", async () => {
    const response = await request(app).get(`/${mockPostIds[0]}`);
    expect(response.body).toMatchObject({
      content: "1st post by Steve",
    });
  });
});

describe("if valid pid but post does not exist", () => {
  test("returns 404 error", async () => {
    const idOfNonExistantPost = new mongoose.Types.ObjectId();
    const response = await request(app).get(`/${idOfNonExistantPost}`);
    expect(response.statusCode).toBe(404);
  });
});
