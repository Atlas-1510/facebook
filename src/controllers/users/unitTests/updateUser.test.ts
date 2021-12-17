import { updateUser } from "../users";
import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import populateMockDatabase from "../../../utils/populateMockDatabase";
import generateTestApp from "../../../utils/generateTestApp";

const app = generateTestApp("put", "/:uid", updateUser);

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

describe("given invalid input", () => {
  test("should respond with 400 status code", async () => {
    const response = await request(app).put(`/invalid_UID`);
    expect(response.body.errors.length).toBe(1);
    expect(response.statusCode).toBe(400);
  });
});
describe("given valid input", () => {
  test("should respond with updated user object", async () => {
    const newUserData = {
      email: "sam@wilson.com",
      firstName: "Sam",
      lastName: "Wilson",
    };

    const response = await request(app)
      .put(`/${mockUserIds[0]}`)
      .send(newUserData);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expect.objectContaining(newUserData));
  });
  describe("if user does not exist in database", () => {
    const nonExistingUserDocId = new mongoose.Types.ObjectId();
    test("returns 200 status code and warns user not found", async () => {
      const response = await request(app).put(`/${nonExistingUserDocId}`);
      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe("User not found in database");
    });
  });
});
