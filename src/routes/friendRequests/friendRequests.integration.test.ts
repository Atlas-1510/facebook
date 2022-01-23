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
  toBeDistinct(received) {
    const pass =
      Array.isArray(received) && new Set(received).size === received.length;
    if (pass) {
      return {
        message: () =>
          `expected [${received}] array to have no duplicate elements`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `expected [${received}] array not to have duplicate elements`,
        pass: false,
      };
    }
  },
});

describe("/api/friendRequests/", () => {
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

  describe("if not logged in", () => {
    describe("POST", () => {
      test("asks client to login and retry", async () => {
        const response = await agent.get("/api/posts/newsfeed");
        expect(response.body).toMatchObject({
          message: "Please login to view this",
        });
      });
    });
  });
  describe("if logged in", () => {
    beforeEach(async () => {
      await agent
        .post("/auth/login")
        .send({
          email: "tony@stark.com",
          password: 12345,
        })
        .type("form");
    });
    describe("POST", () => {
      test("Updates inbound and outbound arrays for request-author and request-target accounts", async () => {
        // Tony [1] is sending a friend request to Peter [2]
        const response = await agent.post("/api/friendRequests").send({
          fid: users[2]._id,
        });
        expect(response.statusCode).toBe(201);
        const tonyResponse = await agent.get(`/api/users/${users[1]._id}`);
        expect(tonyResponse.body.outboundFriendRequests).toContain(users[2].id);
        const peterResponse = await agent.get(`/api/users/${users[2]._id}`);
        expect(peterResponse.body.inboundFriendRequests).toContain(users[1].id);
      });
      test("Rejects request if author is already a friend of the target", async () => {
        // Tony [1] is send a friend request to Steve [0], but they are already friends
        const response = await agent.post("/api/friendRequests").send({
          fid: users[0]._id,
        });
        expect(response.statusCode).toBe(400);
        const tonyResponse = await agent.get(`/api/users/${users[1]._id}`);
        expect(tonyResponse.body.outboundFriendRequests).not.toContain(
          users[0]._id
        );
        const steveResponse = await agent.get(`/api/users/${users[0]._id}`);
        expect(steveResponse.body.inboundFriendRequests).not.toContain(
          users[1]._id
        );
      });
      test("Rejects request if author has already sent a friend request to the target", async () => {
        // Tony [1] is sending a friend request to Bruce [3], but one has already been sent
        const response = await agent.post("/api/friendRequests").send({
          fid: users[3]._id,
        });
        expect(response.statusCode).toBe(400);
        const tonyResponse = await agent.get(`/api/users/${users[1]._id}`);
        expect(tonyResponse.body.outboundFriendRequests).toBeDistinct();
        const bruceResponse = await agent.get(`/api/users/${users[3]._id}`);
        expect(bruceResponse.body.inboundFriendRequests).toBeDistinct();
      });
    });
    describe("DELETE", () => {
      test("If valid input, removes friend request from inbound/outbound arrays on user documents", async () => {
        const response = await agent.delete(`/api/friendRequests/`).send({
          fid: users[3]._id,
        });
        const tony = response.body;
        expect(tony.outboundFriendRequests).not.toContain(users[3].id);
        const bruceResponse = await agent.get(`/api/users/${users[3]._id}`);
        const bruce = bruceResponse.body;
        expect(bruce.inboundFriendRequests).not.toContain(users[1].id);
      });
      test("If tries to delete a friend request that doesn't exist, return 400 error", async () => {
        const response = await agent.delete(`/api/friendRequests/`).send({
          fid: users[2]._id,
        });
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe(
          "That friend request could not be found."
        );
      });
      test("If tries to delete a friend request to a non-existant account, return 404 error", async () => {
        const nonExistantUserID = new mongoose.Types.ObjectId();
        const response = await agent.delete(`/api/friendRequests/`).send({
          fid: nonExistantUserID,
        });
        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe(
          "The target for this friend request could not be found."
        );
      });
    });
  });
  describe("/handle", () => {
    describe("if not logged in", () => {
      describe("POST", () => {
        test("asks client to login and retry", async () => {
          const response = await agent.get("/api/posts/newsfeed");
          expect(response.body).toMatchObject({
            message: "Please login to view this",
          });
        });
      });
    });
    describe("if logged in", () => {
      beforeEach(async () => {
        await agent
          .post("/auth/login")
          .send({
            email: "bruce@banner.com",
            password: 12345,
          })
          .type("form");
      });
      describe("POST", () => {
        test("if a friend request is ACCEPTED, updates friend arrays and deletes request record", async () => {
          const response = await agent.post(`/api/friendRequests/handle`).send({
            fid: users[1]._id,
            action: "accept",
          });
          const bruce = response.body;
          expect(bruce.friends).toContain(users[1].id);
          expect(bruce.inboundFriendRequests).not.toContain(users[1].id);
          const tonyResponse = await agent.get(`/api/users/${users[1]._id}`);
          const tony = tonyResponse.body;
          expect(tony.friends).toContain(users[3].id);
          expect(tony.inboundFriendRequests).not.toContain(users[3].id);
        });
        test("if a friend request is REJECTED, updates friend arrays and deletes request record", async () => {
          const response = await agent.post(`/api/friendRequests/handle`).send({
            fid: users[1]._id,
            action: "reject",
          });
          const bruce = response.body;
          expect(bruce.friends).not.toContain(users[1].id);
          expect(bruce.inboundFriendRequests).not.toContain(users[1].id);
          const tonyResponse = await agent.get(`/api/users/${users[1]._id}`);
          const tony = tonyResponse.body;
          expect(tony.friends).not.toContain(users[3].id);
          expect(tony.inboundFriendRequests).not.toContain(users[3].id);
        });
        test("If invalid action is provided in body, return 400 error", async () => {
          const response = await agent.post(`/api/friendRequests/handle`).send({
            fid: users[1]._id,
            action: "INVALID_ACTION",
          });
          expect(response.statusCode).toBe(400);
        });
        test("If a user tries to accept a non existant friend request, return 400 error", async () => {
          const response = await agent.post(`/api/friendRequests/handle`).send({
            fid: users[0]._id,
            action: "accept",
          });
          expect(response.statusCode).toBe(400);
          expect(response.body.message).toBe(
            "A friend request could not be found from this user."
          );
        });
      });
    });
  });
});
