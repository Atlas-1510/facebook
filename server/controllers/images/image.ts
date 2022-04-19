import express from "express";
import { getFileStream } from "../../s3";

const getImage = (req: express.Request, res: express.Response) => {
  const { key } = req.params;
  if (key === "undefined") {
    console.log(`getImage key is of type ${typeof key}`);
    throw new Error("getImage recieved 'undefined' as a string input");
  }

  const readStream = getFileStream(key);
  return readStream.pipe(res);
};

export { getImage };
