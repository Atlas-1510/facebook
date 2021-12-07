import app from "./app/app";
// import database from "./database/database";
import mongoConfig from "./mongoConfig";
require("dotenv").config();

mongoConfig();
app.listen(process.env.PORT, () => `Listening on port ${process.env.PORT}`);
