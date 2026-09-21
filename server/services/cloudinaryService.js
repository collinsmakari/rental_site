import "dotenv/config";

import { v2 as cloudinary } from "cloudinary";

const getCloudinary = () => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();

  console.log("=================================");
  console.log("CLOUDINARY UPLOAD CONFIG");
  console.log("Cloud name:", cloudName ? "LOADED" : "MISSING");
  console.log("API key:", apiKey ? "LOADED" : "MISSING");
  console.log("API secret:", apiSecret ? "LOADED" : "MISSING");
  console.log("=================================");

  if (!cloudName) {
    throw new Error("CLOUDINARY_CLOUD_NAME is missing");
  }

  if (!apiKey) {
    throw new Error("CLOUDINARY_API_KEY is missing");
  }

  if (!apiSecret) {
    throw new Error("CLOUDINARY_API_SECRET is missing");
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });

  return cloudinary;
};

const uploadBuffer = (buffer, resourceType, folder) => {
  return new Promise((resolve, reject) => {
    try {
      if (!buffer) {
        return reject(new Error("No file buffer received"));
      }

      const cloudinaryInstance = getCloudinary();

      const uploadStream =
        cloudinaryInstance.uploader.upload_stream(
          {
            resource_type: resourceType,
            folder,
          },
          (error, result) => {
            if (error) {
              console.error(
                "================================="
              );
              console.error("CLOUDINARY UPLOAD ERROR");
              console.error("Message:", error.message);
              console.error("HTTP Code:", error.http_code);
              console.error(
                "================================="
              );

              reject(error);
              return;
            }

            console.log(
              "================================="
            );
            console.log("CLOUDINARY UPLOAD SUCCESS");
            console.log("Public ID:", result.public_id);
            console.log("URL:", result.secure_url);
            console.log(
              "================================="
            );

            resolve(result);
          }
        );

      uploadStream.end(buffer);
    } catch (error) {
      reject(error);
    }
  });
};

export const uploadPropertyImage = async (buffer) => {
  return uploadBuffer(
    buffer,
    "image",
    "rental-properties/images"
  );
};

export const uploadPropertyVideo = async (buffer) => {
  return uploadBuffer(
    buffer,
    "video",
    "rental-properties/videos"
  );
};