import makeApp from "./app/app";
require("dotenv").config();

const app = makeApp();

app.listen(process.env.PORT, () => `Listening on port ${process.env.PORT}`);
