require("dotenv").config();
const S3 = require("aws-sdk/clients/s3");
import { createReadStream } from "fs";

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey,
});

// uploads a file to s3
export function uploadFile(file: Express.Multer.File) {
  const fileStream = createReadStream(file.path);

  const uploadParams = {
    Bucket: bucketName,
    Body: fileStream,
    Key: file.filename,
  };
  return s3.upload(uploadParams).promise();
}

// downloads a file from s3
export function getFileStream(fileKey: string) {
  const downloadParams = {
    Key: fileKey,
    Bucket: bucketName,
  };

  if (fileKey && fileKey !== "undefined") {
    return s3.getObject(downloadParams).createReadStream();
  } else {
    console.error(
      `fileKey is of type ${typeof fileKey} and has value: ${fileKey}`
    );
  }
}
