import express from "express";

export default function makeApp() {
  const app = express();

  app.use(express.json());

  app.use("/", (req, res, next) => {
    res.send("Express + TypeScript Server");
  });

  return app;
}
