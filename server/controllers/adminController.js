import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Property from "../models/Property.js";

/**
 * Admin login
 *
 * Security features:
 * - bcrypt password verification
 * - generic authentication error
 * - failed-login monitoring
 * - JWT expiration
 * - no password logging
 * - no password returned to frontend
 */
export const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    /*
     * Basic validation
     */
    if (
      typeof username !== "string" ||
      typeof password !== "string" ||
      !username.trim() ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required",
      });
    }

    const configuredUsername =
      process.env.ADMIN_USERNAME;

    const passwordHash =
      process.env.ADMIN_PASSWORD_HASH;

    const jwtSecret =
      process.env.JWT_SECRET;

    /*
     * Make sure the required authentication
     * environment variables exist.
     */
    if (
      !configuredUsername ||
      !passwordHash ||
      !jwtSecret
    ) {
      console.error(
        "Admin authentication environment variables are not configured."
      );

      return res.status(500).json({
        success: false,
        message:
          "Admin authentication is not configured",
      });
    }

    /*
     * Normalize username.
     *
     * This prevents accidental authentication
     * failures caused by leading/trailing spaces.
     */
    const submittedUsername = username.trim();

    /*
     * Username comparison.
     *
     * We intentionally do not reveal whether
     * the username or password was incorrect.
     */
    const usernameMatches =
      submittedUsername === configuredUsername;

    /*
     * Always perform bcrypt comparison when possible.
     *
     * This avoids creating an obvious difference
     * between "unknown username" and "wrong password"
     * responses.
     */
    let passwordMatches = false;

    try {
      passwordMatches = await bcrypt.compare(
        password,
        passwordHash
      );
    } catch (bcryptError) {
      console.error(
        "Admin password verification error:",
        bcryptError.message
      );

      return res.status(500).json({
        success: false,
        message:
          "Admin authentication is temporarily unavailable",
      });
    }

    /*
     * Authentication failed.
     *
     * Do NOT tell the attacker whether the
     * username or password was incorrect.
     */
    if (!usernameMatches || !passwordMatches) {
      console.warn(
        `Failed admin login attempt from IP: ${req.ip}`
      );

      return res.status(401).json({
        success: false,
        message: "Invalid username or password",
      });
    }

    /*
     * Successful login monitoring.
     *
     * Never log the password or JWT.
     */
    console.log(
      `Successful admin login for ${configuredUsername} from IP: ${req.ip}`
    );

    /*
     * Generate JWT.
     */
    const token = jwt.sign(
      {
        username: configuredUsername,
        role: "admin",
      },
      jwtSecret,
      {
        expiresIn: "8h",
      }
    );

    /*
     * Return authentication response.
     */
    return res.status(200).json({
      success: true,
      message: "Admin login successful",
      token,
      admin: {
        username: configuredUsername,
        role: "admin",
      },
    });
  } catch (error) {
    console.error(
      "Admin login error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Admin login failed",
    });
  }
};

/**
 * Get all pending properties
 */
export const getPendingProperties = async (req, res) => {
  try {
    const properties = await Property.find({
      status: "pending",
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: properties.length,
      properties,
    });
  } catch (error) {
    console.error(
      "Get pending properties error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch pending properties",
    });
  }
};

/**
 * Get all properties
 */
export const getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find({}).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: properties.length,
      properties,
    });
  } catch (error) {
    console.error(
      "Get all properties error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch properties",
    });
  }
};

/**
 * Approve property
 */
export const approveProperty = async (req, res) => {
  try {
    const property = await Property.findById(
      req.params.id
    );

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    if (property.status === "approved") {
      return res.status(400).json({
        success: false,
        message: "Property is already approved",
      });
    }

    property.status = "approved";

    await property.save();

    return res.status(200).json({
      success: true,
      message: "Property approved successfully",
      property,
    });
  } catch (error) {
    console.error(
      "Approve property error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Failed to approve property",
    });
  }
};

/**
 * Toggle featured property
 */
export const toggleFeaturedProperty = async (
  req,
  res
) => {
  try {
    const property = await Property.findById(
      req.params.id
    );

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    if (property.status !== "approved") {
      return res.status(400).json({
        success: false,
        message:
          "Only approved properties can be added to featured properties.",
      });
    }

    property.featured = !property.featured;

    await property.save();

    return res.status(200).json({
      success: true,
      message: property.featured
        ? "Property added to featured properties."
        : "Property removed from featured properties.",
      property,
    });
  } catch (error) {
    console.error(
      "Toggle featured property error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to update featured property.",
    });
  }
};

/**
 * Reject property
 */
export const rejectProperty = async (req, res) => {
  try {
    const { reason } = req.body;

    const property = await Property.findById(
      req.params.id
    );

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    if (!reason || !reason.trim()) {
      return res.status(400).json({
        success: false,
        message: "Rejection reason is required",
      });
    }

    property.status = "rejected";
    property.rejectionReason = reason.trim();

    await property.save();

    return res.status(200).json({
      success: true,
      message: "Property rejected successfully",
      property,
    });
  } catch (error) {
    console.error(
      "Reject property error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Failed to reject property",
    });
  }
};