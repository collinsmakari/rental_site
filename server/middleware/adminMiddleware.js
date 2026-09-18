import crypto from "crypto";

const adminMiddleware = (req, res, next) => {
  try {
    const adminKey = req.headers["x-admin-key"];

    if (!adminKey) {
      return res.status(401).json({
        success: false,
        message: "Admin authentication required",
      });
    }

    const configuredKey = process.env.ADMIN_KEY;

    if (!configuredKey) {
      console.error("ADMIN_KEY is not configured in .env");

      return res.status(500).json({
        success: false,
        message: "Admin authentication is not configured",
      });
    }

    const providedBuffer = Buffer.from(String(adminKey));
    const configuredBuffer = Buffer.from(String(configuredKey));

    if (
      providedBuffer.length !== configuredBuffer.length ||
      !crypto.timingSafeEqual(
        providedBuffer,
        configuredBuffer
      )
    ) {
      return res.status(403).json({
        success: false,
        message: "Invalid admin credentials",
      });
    }

    next();
  } catch (error) {
    console.error("Admin authentication error:", error);

    return res.status(500).json({
      success: false,
      message: "Admin authentication failed",
    });
  }
};

export default adminMiddleware;