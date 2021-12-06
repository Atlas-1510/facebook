import makeApp from "./app/app";
import database from "./database/database";
require("dotenv").config();

const app = makeApp(database);

app.listen(process.env.PORT, () => `Listening on port ${process.env.PORT}`);
