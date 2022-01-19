import request, { agent, SuperAgentTest } from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose, { Types } from "mongoose";
import populateMockDatabase from "../../utils/populateMockDatabase";
import app from "../../app/app";
import Comment, { CommentInterface } from "../../models/Comment";
import { PostInterface } from "../../models/Post";

describe("/api/posts", () => {
  let mongoServer: MongoMemoryServer;
  let mockUserIds: string[];
  let mockPostIds: string[];
  let mockCommentIds: string[];
  let agent: SuperAgentTest = request.agent(app);
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });
  beforeEach(async () => {
    mongoose.connection.dropDatabase();
    ({ mockUserIds, mockPostIds, mockCommentIds } =
      await populateMockDatabase());
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
        .post("/login")
        .send({
          email: "steve@rogers.com",
          password: 12345,
        })
        .type("form");
    });
    describe("POST", () => {
      describe("given valid input", () => {
        test("Returns newly created post", async () => {
          const post = {
            author: mockUserIds[0],
            content: "This is some post content",
            comments: [],
          };
          const response = await agent.post("/api/posts").send(post);
          expect(response.body).toMatchObject({
            content: "This is some post content",
            comments: [],
          });
        });
      });
      describe("given invalid input", () => {
        test("returns 400 error", async () => {
          const post = {
            author: mockUserIds[0],
            content: null, // must be a string
            comments: [],
          };
          const response = await agent.post("/api/posts").send(post);
          expect(response.statusCode).toBe(400);
          expect(response.body.errors).toContainEqual(
            expect.objectContaining({ msg: "Invalid value" })
          );
        });
      });
    });
  });

  describe("/newsfeed", () => {
    describe("if not logged in", () => {
      describe("GET", () => {
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
          .post("/login")
          .send({
            email: "steve@rogers.com",
            password: 12345,
          })
          .type("form");
      });
      describe("GET", () => {
        test("returns newsfeed posts for logged in user", async () => {
          const response = await agent.get("/api/posts/newsfeed");
          expect(response.body.length).toBe(3);
          // Steve and Peter are not friends (see populateMockDatabase)
          expect(response.body).not.toContainEqual(
            expect.objectContaining({
              content: "1st post by Peter",
            })
          );
        });
      });
    });
  });
  describe("/:pid", () => {
    describe("if not logged in", () => {
      describe("GET", () => {
        test("asks client to login and retry", async () => {
          const response = await agent.get(`/api/posts/${mockPostIds[0]}`);
          expect(response.body).toMatchObject({
            message: "Please login to view this",
          });
        });
      });
      describe("PUT", () => {
        test("asks client to login and retry", async () => {
          const newPostData = {
            content: "This is the newly updated post content",
          };

          const response = await agent
            .put(`/api/posts/${mockPostIds[0]}`)
            .send(newPostData);
          expect(response.body).toMatchObject({
            message: "Please login to view this",
          });
        });
      });
    });
    describe("if logged in", () => {
      beforeEach(async () => {
        await agent
          .post("/login")
          .send({
            email: "steve@rogers.com",
            password: 12345,
          })
          .type("form");
      });
      describe("GET", () => {
        describe("if invalid pid", () => {
          test("returns 400 error", async () => {
            const response = await agent.get("/api/posts/INVALID_PID");
            expect(response.body.errors.length).toBe(1);
            expect(response.statusCode).toBe(400);
          });
        });
        describe("if valid pid", () => {
          test("returns post", async () => {
            const response = await agent.get(`/api/posts/${mockPostIds[0]}`);
            expect(response.body).toMatchObject({
              content: "1st post by Steve",
            });
          });
        });
        describe("if valid pid but post does not exist", () => {
          test("returns 404 error", async () => {
            const idOfNonExistantPost = new mongoose.Types.ObjectId();
            const response = await agent.get(
              `/api/posts/${idOfNonExistantPost}`
            );
            expect(response.statusCode).toBe(404);
          });
        });
      });
      describe("PUT", () => {
        describe("if invalid pid", () => {
          test("returns 400 error", async () => {
            const newPostData = {
              content: "This is the newly updated post content",
            };
            const response = await agent
              .put("/api/posts/INVALID_PID")
              .send(newPostData);
            expect(response.body.errors.length).toBe(1);
            expect(response.statusCode).toBe(400);
          });
        });
        describe("if valid pid", () => {
          test("returns updated post", async () => {
            const newPostData = {
              content: "This is the newly updated post content",
            };

            const response = await agent
              .put(`/api/posts/${mockPostIds[0]}`)
              .send(newPostData);
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual(expect.objectContaining(newPostData));
          });
        });
      });
    });
  });
  describe("/:pid/comments", () => {
    describe("if logged in", () => {
      beforeEach(async () => {
        await agent
          .post("/login")
          .send({
            email: "steve@rogers.com",
            password: 12345,
          })
          .type("form");
      });
      describe("POST", () => {
        describe("given valid pid and comment content", () => {
          test("Returns post with added comment", async () => {
            const newComment = {
              author: mockUserIds[0],
              content: "This is some comment content",
            };
            const response = await agent
              .post(`/api/posts/${mockPostIds[0]}/comments`)
              .send(newComment);
            expect(response.body.comments).toEqual(
              expect.arrayContaining([
                expect.objectContaining({
                  content: "This is some comment content",
                }),
              ])
            );
          });
        });
        describe("given valid pid and invalid comment content", () => {
          test("returns 400 error", async () => {
            const newComment = {
              author: mockUserIds[0],
              content: null,
            };
            const response = await agent
              .post(`/api/posts/${mockPostIds[0]}/comments`)
              .send(newComment);
            expect(response.statusCode).toBe(400);
            expect(response.body.errors).toContainEqual(
              expect.objectContaining({ msg: "Invalid value" })
            );
          });
        });
      });

      describe("PUT", () => {
        describe("given valid pid, cid, and comment content", () => {
          test("responds with post including updating comment", async () => {
            const newCommentContent = {
              content: "This is UPDATED comment content",
            };
            const response = await agent
              .put(`/api/posts/${mockPostIds[0]}/comments/${mockCommentIds[0]}`)
              .send(newCommentContent);
            expect(response.body.comments).toContainEqual(
              expect.objectContaining(newCommentContent)
            );
          });
        });
      });
    });
  });
});
