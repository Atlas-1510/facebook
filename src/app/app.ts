import express from "express";
import routesConfig from "../routes/routesConfig";

const app = express();

app.use(express.json());

app.use("/api", routesConfig);

export default app;
