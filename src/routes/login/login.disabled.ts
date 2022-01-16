import express from "express";
import loginRouter from "./login";
import passport from "passport";
import passportConfig from "../../passportConfig";
import createHttpError from "http-errors";
import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import loadMockUsers from "../users/loadMockUsers";

const app = express();
app.use(express.urlencoded({ extended: false }));
passportConfig(passport);
app.use(passport.initialize());
app.use("/login", loginRouter);
app.use(function (req, res, next) {
  next(createHttpError(404));
});
describe("/login", () => {
  let mongoServer: MongoMemoryServer;
  let testUserIds: string[];
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });
  beforeEach(async () => {
    testUserIds = await loadMockUsers();
  });
  afterAll(async () => {
    if (mongoose.connection.db) {
      await mongoose.connection.close();
    }
    if (mongoServer) {
      await mongoServer.stop();
    }
  });
  describe("given login request with valid credentials", () => {
    test("should successfully return user information", async () => {
      const response = await request(app)
        .post("/login")
        .send({
          email: "steve@rogers.com",
          password: "12345",
        })
        .type("form");
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(
        expect.objectContaining({
          email: "steve@rogers.com",
          firstName: "Steve",
          lastName: "Rogers",
        })
      );
    });
  });
});
