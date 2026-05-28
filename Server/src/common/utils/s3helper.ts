import s3 from "./s3Upload";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

const bucketName = process.env.AWS_S3_BUCKET;
export const deleteFromS3 = async (fileUrl: string): Promise<void> => {
  try {
    const key = fileUrl.split(".com/")[1];
    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key,
    });
    await s3.send(command);
    console.log("Deleted from s3: ", key);
  } catch (err: any) {
    console.error("S3 deletion failed: ", err.message);
  }
};
