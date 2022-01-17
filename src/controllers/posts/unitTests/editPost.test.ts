import { editPost } from "../posts";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import generateTestApp from "../../../utils/generateTestApp";
import populateMockDatabase from "../../../utils/populateMockDatabase";
import request from "supertest";

const app = generateTestApp("put", "/:pid", editPost);

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
    const response = await request(app).put("/INVALID_PID");
    expect(response.body.errors.length).toBe(1);
    expect(response.statusCode).toBe(400);
  });
});

describe("if valid pid", () => {
  test("returns updated post", async () => {
    const newPostData = {
      content: "This is the newly updated post content",
    };

    const response = await request(app)
      .put(`/${mockPostIds[0]}`)
      .send(newPostData);
    expect(response.statusCode).toBe(200);
    console.log(response.body);
    expect(response.body).toEqual(expect.objectContaining(newPostData));
  });
});
