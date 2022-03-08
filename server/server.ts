import app from "./app/app";
import mongoConfig from "./mongoConfig";
import express from "express";
import path from "path";

const debug = require("debug")("facebook:server");
require("dotenv").config();

mongoConfig();

app.listen(process.env.PORT, () =>
  console.log(`Listening on port ${process.env.PORT}`)
);
// if (process.env.NODE_ENV === "production") {
if (true) {
  const dir = path.join(__dirname, "../../client/build");
  console.log(dir);
  app.use(express.static(dir));

  app.get("/", (req, res, next) => {
    res.sendFile(path.join(__dirname, "../../client/build/index.html"));
  });
}
