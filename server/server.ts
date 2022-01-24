import app from "./app/app";
import mongoConfig from "./mongoConfig";
const debug = require("debug")("facebook:server");
require("dotenv").config();

mongoConfig();
app.listen(process.env.PORT, () =>
  debug(`Listening on port ${process.env.PORT}`)
);
