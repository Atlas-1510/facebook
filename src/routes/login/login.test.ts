import express from "express";
import request from "supertest";
import loginRouter from "./login";
import createHttpError from "http-errors";

const app = express();
app.use("/login", loginRouter);
app.use(function (req, res, next) {
  next(createHttpError(404));
});

describe("/login", () => {
  test("returns 200 status code", async () => {
    const response = await request(app).post("/login");
    expect(response.text).toBe("returned from login route");
  });
});
