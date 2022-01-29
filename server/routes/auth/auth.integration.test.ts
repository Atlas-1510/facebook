import request, { agent, SuperAgentTest } from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose, { Types } from "mongoose";
import populateMockDatabase from "../../utils/populateMockDatabase";
import app from "../../app/app";
import { UserInput, UserDocument } from "../../models/User";
import Comment, {
  CommentInput,
  CommentDocument,
  CommentSchema,
} from "../../models/Comment";
import { PostInput, PostDocument } from "../../models/Post";

expect.extend({
  toContainObject(received, argument) {
    const pass = this.equals(
      received,
      expect.arrayContaining([expect.objectContaining(argument)])
    );

    if (pass) {
      return {
        message: () =>
          `expected ${this.utils.printReceived(
            received
          )} not to contain object ${this.utils.printExpected(argument)}`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `expected ${this.utils.printReceived(
            received
          )} to contain object ${this.utils.printExpected(argument)}`,
        pass: false,
      };
    }
  },
});

describe("/auth", () => {
  let mongoServer: MongoMemoryServer;
  let users: UserDocument[];
  let posts: PostDocument[];
  let comments: CommentDocument[];
  let agent: SuperAgentTest = request.agent(app);
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });
  beforeEach(async () => {
    mongoose.connection.dropDatabase();
    ({ users, posts, comments } = await populateMockDatabase());
  });
  afterAll(async () => {
    if (mongoose.connection.db) {
      await mongoose.connection.close();
    }
    if (mongoServer) {
      await mongoServer.stop();
    }
  });

  describe("/signup", () => {
    // Given valid details, creates new user, logs user in, and returns user document without hashed password
    test("Given valid input, creates new user and returns user document without hashed password", async () => {
      const mockUser = {
        firstName: "Matt",
        lastName: "Murdoch",
        email: "matt@murdoch.com",
      };
      const response = await agent
        .post("/auth/signup")
        .send({ ...mockUser, password: "the_blind_guy" });
      expect(response.statusCode).toBe(201);
      expect(response.body).toMatchObject(mockUser);
      // user password should not be returned to client
      expect(response.body.password).not.toBeDefined();

      const allUsers = await agent.get("/api/users");
      // user should be logged in after sign up, allowing further API requests
      expect(allUsers.body).not.toMatchObject({
        message: "Please login to view this",
      });
      // user should be in database
      expect(allUsers.body).toContainObject({
        email: "matt@murdoch.com",
      });
    });
  });
});
