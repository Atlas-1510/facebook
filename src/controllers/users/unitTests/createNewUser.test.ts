import { createNewUser } from "../users";
import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import populateMockDatabase from "../../../utils/populateMockDatabase";
import generateTestApp from "../../../utils/generateTestApp";
import User from "../../../models/User";

const app = generateTestApp("post", "/", createNewUser);

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
describe("given valid input for a new user", () => {
  test("saves and returns the new user document", async () => {
    const response = await request(app).post("/").send({
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
describe("given invalid input for a new user", () => {
  test("missing email - throws error", async () => {
    const response = await request(app).post("/").send({
      // email: "wanda@maximoff.com",
      firstName: "Wanda",
      lastName: "Maximoff",
    });
    expect(response.body.errors.length).toBe(1);
    expect(response.statusCode).toBe(400);
  });
  test("missing firstName - throws error", async () => {
    const response = await request(app).post("/").send({
      email: "wanda@maximoff.com",
      // firstName: "Wanda",
      lastName: "Maximoff",
    });
    expect(response.body.errors.length).toBe(1);
    expect(response.statusCode).toBe(400);
  });
  test("missing lastName - throws error", async () => {
    const response = await request(app).post("/").send({
      email: "wanda@maximoff.com",
      firstName: "Wanda",
      // lastName: "Maximoff",
    });
    expect(response.body.errors.length).toBe(1);
    expect(response.statusCode).toBe(400);
  });
});
