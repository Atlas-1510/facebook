import { unlink } from "fs";
import { promisify } from "util";

const unlinkFile = promisify(unlink);

export default unlinkFile;
