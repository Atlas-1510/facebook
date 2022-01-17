import { getAllUsers } from "../users";
import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import populateMockDatabase from "../../../utils/populateMockDatabase";
import generateTestApp from "../../../utils/generateTestApp";
import User from "../../../models/User";

const app = generateTestApp("get", "/", getAllUsers);

let mongoServer: MongoMemoryServer;
let mockUserIds: string[];
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
test("makes read request to database", async () => {
  const users = await User.find();
  expect(users.length).toBe(4);
  const result = await request(app).get("/");
  expect(result.body.length).toBe(4);
});
