/**
 * @author uday pratap
 * @description
 */
import { Request } from "express";
import s3 from "../utils/s3Upload";
import multer from "multer";
import multerS3 from "multer-s3";
import path from "path";

const bucketName = process.env.AWS_S3_BUCKET!;

const uploadFiles = multer({
  storage: multerS3({
    s3,
    bucket: bucketName,
    // acl: "public-read",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req: Request, file: any, cb: any) => {
      const timestamp = Date.now();
      const safename = file.originalname.replace(/\s+/g, "-");

        // Added By  ----   Aman kumar singh for video kyc    
      // folder structure (VERY IMPORTANT FOR KYC)
      let folder = "uploads";

      if (file.mimetype.startsWith("image/")) folder = "images";
      else if (file.mimetype.startsWith("video/")) folder = "videos";
      else if (file.mimetype === "application/pdf") folder = "documents";

      // cb(null, `image/${timestamp}_${safename}`);
      cb(null, `${folder}/${timestamp}_${safename}`);
    },
  }),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req: any, file: any, cb: any) => {
    const allowedMimeTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/svg+xml",

          //videos (NEW)    Aman kumar singh
      "video/mp4",
      "video/webm",
      "video/mkv",

      // documents (future KYC)
      "application/pdf",
    ];
     const allowedExtensions = [
      ".jpg",
      ".jpeg",
      ".png",
      ".webp",
      ".svg",
        ".mp4",
      ".webm",
      ".mkv",
      ".pdf",
    ];
     const ext = path.extname(file.originalname).toLowerCase();
    if (
      allowedMimeTypes.includes(file.mimetype) &&
      allowedExtensions.includes(ext)
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  },
});

export default uploadFiles;
