import multer from "multer";

// Store uploaded files temporarily in memory.
// They will be sent to Cloudinary by the controller.
const storage = multer.memoryStorage();

// Allow only images and videos.
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype.startsWith("image/") ||
    file.mimetype.startsWith("video/")
  ) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only image and video files are allowed."
      ),
      false
    );
  }
};

// Multer configuration
const upload = multer({
  storage,

  fileFilter,

  limits: {
    // Maximum number of uploaded files
    files: 15,

    // Maximum size of each file: 100 MB
    fileSize: 100 * 1024 * 1024,
  },
});

export default upload;