import Property from "../models/Property.js";

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
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch pending properties",
      error: error.message,
    });
  }
};

/**
 * Get all properties
 */
export const getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find({})
      .sort({
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
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch properties",
      error: error.message,
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
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to approve property",
      error: error.message,
    });
  }
};

/**
 * Reject property
 */
export const rejectProperty = async (req, res) => {
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

    property.status = "rejected";

    await property.save();

    return res.status(200).json({
      success: true,
      message: "Property rejected successfully",
      property,
    });
  } catch (error) {
    console.error(
      "Reject property error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to reject property",
      error: error.message,
    });
  }
};