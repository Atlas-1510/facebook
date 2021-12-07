import loadApp from "./utils/loadApp";
import mongoConfig from "./mongoConfig";
require("dotenv").config();

mongoConfig();
const app = loadApp();
app.listen(process.env.PORT, () => `Listening on port ${process.env.PORT}`);
