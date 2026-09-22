import jwt from "jsonwebtoken";

const adminMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Admin authentication required",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Admin authentication required",
      });
    }

    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      console.error("JWT_SECRET is not configured.");

      return res.status(500).json({
        success: false,
        message: "Admin authentication is not configured",
      });
    }

    const decoded = jwt.verify(token, jwtSecret);

    if (decoded.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access denied",
      });
    }

    req.admin = decoded;

    next();
  } catch (error) {
    console.error("Admin authentication error:", error);

    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired admin session",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Admin authentication failed",
    });
  }
};

export default adminMiddleware;