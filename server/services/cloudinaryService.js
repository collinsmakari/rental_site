import cloudinary from "../config/cloudinary.js";

/**
 * Upload a file buffer to Cloudinary
 */
const uploadBuffer = (buffer, resourceType, folder) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: resourceType,
        folder,
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(result);
      }
    );

    uploadStream.end(buffer);
  });
};

/**
 * Upload property image
 */
export const uploadPropertyImage = async (buffer) => {
  return uploadBuffer(
    buffer,
    "image",
    "rental-properties/images"
  );
};

/**
 * Upload property video
 */
export const uploadPropertyVideo = async (buffer) => {
  return uploadBuffer(
    buffer,
    "video",
    "rental-properties/videos"
  );
};