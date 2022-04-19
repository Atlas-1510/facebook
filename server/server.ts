import app from "./app/app";
import mongoConfig from "./mongoConfig";
import express from "express";
import path from "path";

const debug = require("debug")("facebook:server");
require("dotenv").config();

mongoConfig();

app.listen(process.env.SERVER_PORT, () =>
  console.log(`Listening on port ${process.env.SERVER_PORT}`)
);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../../client/build")));

  app.get("/", (req, res, next) => {
    res.sendFile(path.join(__dirname, "../../client/build/index.html"));
  });
}
