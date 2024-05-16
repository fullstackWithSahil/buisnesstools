import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import multer from "multer";
import multerS3 from "multer-s3";

// Create an S3 client with your AWS credentials
const s3Client = new S3Client({
  credentials: {
    accessKeyId: process.env.SES_ACCESS_KEY!,
    secretAccessKey: process.env.SES_SECRET_KEY!,
  },
  region: process.env.REGION,
});

export const upload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: "buisnesstoolsiwtfswc24h", // Replace with your S3 bucket name
    acl: "public-read",
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString() + "-" + file.originalname);
    },
  }),
});

export const uploadImageToS3 = async ({
  imageData,
  key,
  type,
}: {
  imageData: Buffer;
  key: string;
  type: string;
}) => {
  const uploadParams = {
    Bucket: "buisnesstoolsiwtfswc24h", // Replace "your-bucket-name" with your S3 bucket name
    Key: key,
    Body: imageData, // Provide the image data as a ReadableStream or Buffer
    ContentType: type,
  };
  try {
    await s3Client.send(new PutObjectCommand(uploadParams));
  } catch (error) {
    console.error("Error uploading image:", error);
  }
};

export const getImageFromS3 = async (key: string) => {
  const params = {
    Bucket: "buisnesstoolsiwtfswc24h", // Replace with your bucket name
    Key: key, // The key of the image you want to retrieve
  };

  try {
    const data = await s3Client.send(new GetObjectCommand(params));
    return data;
  } catch (error) {
    console.error("Error getting image from S3:", error);
    throw error;
  }
};

export async function getObject(key: string) {
  const command = new GetObjectCommand({
    Bucket: "buisnesstoolsiwtfswc24h",
    Key: key,
  });

  try {
    const url = await getSignedUrl(s3Client, command);
    return url;
  } catch (error) {
    console.error("Error getting signed URL:", error);
  }
}
