/**
 * @author Aman kumar singh
 * @description
 */
import { Request } from "express";
import multer from "multer";
import multerS3 from "multer-s3";
import path from "path";
import s3 from "../utils/s3Upload";

const bucketName = process.env.AWS_S3_BUCKET!;

const videoUpload = multer({
  storage: multerS3({
    s3,
    bucket: bucketName,

    contentType: multerS3.AUTO_CONTENT_TYPE,

    key: (req: Request, file: any, cb: any) => {
      const timestamp = Date.now();
      const safeName = file.originalname.replace(/\s+/g, "-");

      cb(null, `kyc/videos/${timestamp}_${safeName}`);
    },
  }),

  limits: {
    fileSize: 50 * 1024 * 1024, //  50MB (video ke liye)
  },

  fileFilter: (req: any, file: any, cb: any) => {

    const allowedMimeTypes = [
      "video/mp4",
      "video/mpeg",
      "video/quicktime",
      "video/x-matroska", // mkv
    ];

    const allowedExtensions = [
      ".mp4",
      ".mov",
      ".avi",
      ".mkv",
    ];

    const ext = path.extname(file.originalname).toLowerCase();

    if (
      allowedMimeTypes.includes(file.mimetype) &&
      allowedExtensions.includes(ext)
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only video files are allowed"), false);
    }
  },
}).single("video"); //  important

export default videoUpload;
