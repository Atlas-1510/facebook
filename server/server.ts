import app from "./app/app";
import mongoConfig from "./mongoConfig";
import express from "express";
import path from "path";

const debug = require("debug")("facebook:server");
require("dotenv").config();

mongoConfig();
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));

  app.get("*", (req, res, next) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
} else {
  app.listen(process.env.PORT, () =>
    debug(`Listening on port ${process.env.PORT}`)
  );
}
