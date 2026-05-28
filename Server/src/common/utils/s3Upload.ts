import { S3Client } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
dotenv.config();

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});
export default s3;

// export const uploadToS3 = async (
//   file: Express.Multer.File,
// ): Promise<string> => {
//   const filename = `${Date.now()}_${file.originalname}`;
//   const command = new PutObjectCommand({
//     Bucket: bucketName,
//     Key: filename,
//     Body: file.buffer,
//     ContentType: file.mimetype,
//     // ACL: "public-read",
//   });

//   await s3.send(command);

//   return `https://${bucketName}.s3.amazonaws.com/${filename}`;
// };
