import request, { agent, SuperAgentTest } from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose, { Types } from "mongoose";
import populateMockDatabase from "../../utils/populateMockDatabase";
import app from "../../app/app";
import Comment, {
  CommentInput,
  CommentDocument,
  CommentSchema,
} from "../../models/Comment";
import { PostInput, PostDocument } from "../../models/Post";
import { UserInput, UserDocument } from "../../models/User";

describe("/api/posts", () => {
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
          email: "steve@rogers.com",
          password: "test",
        })
        .type("form");
    });
    describe("POST", () => {
      describe("given valid input", () => {
        test("Returns newly created post", async () => {
          const post: PostInput = {
            author: users[0]._id,
            content: "This is some post content",
            comments: [],
            likes: [],
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
          // intentionally left PostInput type definition off this to test
          const post = {
            author: users[0]._id,
            content: null, // should normally be a string, testing if error is handled
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
          .post("/auth/login")
          .send({
            email: "steve@rogers.com",
            password: "test",
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
          const response = await agent.get(`/api/posts/${posts[0]._id}`);
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
            .put(`/api/posts/${posts[0]._id}`)
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
          .post("/auth/login")
          .send({
            email: "steve@rogers.com",
            password: "test",
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
            const response = await agent.get(`/api/posts/${posts[0]._id}`);
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
              .put(`/api/posts/${posts[0]._id}`)
              .send(newPostData);
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual(expect.objectContaining(newPostData));
          });
        });
      });
      describe("DELETE", () => {
        describe("if client is post author", () => {
          test("deletes post and returns confirmation", async () => {
            const response = await agent.delete(`/api/posts/${posts[0]._id}`);
            expect(response.statusCode).toBe(200);
            expect(response.body).toMatchObject(
              expect.objectContaining({
                message: "Post has been deleted",
              })
            );
          });
        });
        describe("if client is not post author", () => {
          test("returns 403 error", async () => {
            const response = await agent.delete(`/api/posts/${posts[1]._id}`);
            expect(response.statusCode).toBe(403);
          });
        });
      });
    });
  });
  describe("/:pid/comments", () => {
    describe("if logged in", () => {
      beforeEach(async () => {
        await agent
          .post("/auth/login")
          .send({
            email: "steve@rogers.com",
            password: "test",
          })
          .type("form");
      });
      describe("POST", () => {
        describe("given valid pid and comment content", () => {
          test("Returns post with added comment", async () => {
            const newComment = {
              content: "This is some comment content",
            };
            const response = await agent
              .post(`/api/posts/${posts[0]._id}/comments`)
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
              content: null,
            };
            const response = await agent
              .post(`/api/posts/${posts[0]._id}/comments`)
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
          test("responds with post including updated comment", async () => {
            const newCommentContent = {
              content: "This is UPDATED comment content",
            };
            const response = await agent
              .put(`/api/posts/${posts[0]._id}/comments/${comments[0]._id}`)
              .send(newCommentContent);
            expect(response.body.comments).toContainEqual(
              expect.objectContaining(newCommentContent)
            );
          });
          test("only allow comment author to edit comment", async () => {
            const newCommentContent = {
              content: "Steve is trying to update Tony's comment",
            };
            const response = await agent
              .put(`/api/posts/${posts[0]._id}/comments/${comments[1]._id}`)
              .send(newCommentContent);
            expect(response.statusCode).toBe(403);
            expect(response.body).toMatchObject({
              error: "Only the author can edit this content.",
            });
          });
        });
      });

      describe("DELETE", () => {
        describe("given valid pid, cid, and comment content", () => {
          test("responds with post after deleting comment", async () => {
            const comment = {
              content: "1st comment - author[0] - post[0]",
            };
            const response = await agent.delete(
              `/api/posts/${posts[0]._id}/comments/${comments[0]._id}`
            );

            expect(response.statusCode).toBe(200);

            expect(response.body.comments).not.toContainEqual(
              expect.objectContaining(comment)
            );
          });
          test("only allow comment author to edit comment", async () => {
            const response = await agent.delete(
              `/api/posts/${posts[0]._id}/comments/${comments[1]._id}`
            );

            expect(response.statusCode).toBe(403);
            expect(response.body).toMatchObject({
              error: "Only the author can delete this content.",
            });
          });
        });
      });
    });
  });
  describe("/:pid/likes", () => {
    describe("if logged in", () => {
      beforeEach(async () => {
        await agent
          .post("/auth/login")
          .send({
            email: "steve@rogers.com",
            password: "test",
          })
          .type("form");
      });
      describe("POST", () => {
        describe("given valid pid", () => {
          test("update and return post with new like", async () => {
            const response = await agent.post(
              `/api/posts/${posts[1]._id}/likes`
            );
            expect(response.statusCode).toBe(201);
            // Note: matches to .id NOT ._id as ObjectID becomes string after being sent via JSON.
            expect(response.body.likes).toContain(users[0].id);
          });
        });
        describe("given valid but non-existant pid", () => {
          test("returns 404 error", async () => {
            const nonExistantPost = new mongoose.Types.ObjectId();
            const response = await agent.post(
              `/api/posts/${nonExistantPost}/likes`
            );
            expect(response.statusCode).toBe(404);
          });
        });
      });

      describe("DELETE", () => {
        describe("given valid pid", () => {
          test("update and return post without the deleted like", async () => {
            const response = await agent.delete(
              `/api/posts/${posts[0]._id}/likes`
            );

            expect(response.statusCode).toBe(201);
            expect(response.body.likes.length).toBe(0);
          });
        });
        describe("given valid but non-existant pid", () => {
          test("returns 404 error", async () => {
            const nonExistantPost = new mongoose.Types.ObjectId();
            const response = await agent.delete(
              `/api/posts/${nonExistantPost}/likes`
            );
            expect(response.statusCode).toBe(404);
          });
        });
      });
    });
  });
});
