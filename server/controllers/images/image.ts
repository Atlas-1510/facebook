import express from "express";
import { getFileStream } from "../../s3";

const getImage = (req: express.Request, res: express.Response) => {
  const { key } = req.params;
  const readStream = getFileStream(key);
  return readStream.pipe(res);
};

export { getImage };
