import Property from "../models/Property.js";
import Payment from "../models/Payment.js";

// ==========================================
// CREATE PROPERTY
// ==========================================

export const createProperty = async (req, res) => {
  try {
    const property = await Property.create(req.body);

    return res.status(201).json({
      success: true,
      message: "Property created successfully",
      property,
    });
  } catch (error) {
    console.error("Create property error:", error);

    return res.status(400).json({
      success: false,
      message: "Failed to create property",
      error: error.message,
    });
  }
};

// ==========================================
// GET ALL PROPERTIES
// PUBLIC INFORMATION ONLY
// ==========================================

export const getProperties = async (req, res) => {
  try {
    const properties = await Property.find()
      .select(
        "title description location area propertyType price bedrooms bathrooms furnished featured amenities images available createdAt"
      )
      .sort({
        createdAt: -1,
      });

    // ------------------------------------------
    // Only expose the FIRST image publicly
    // ------------------------------------------

    const publicProperties = properties.map((property) => {
      const propertyObject = property.toObject();

      return {
        ...propertyObject,

        images: property.images?.length
          ? [property.images[0]]
          : [],
      };
    });

    return res.status(200).json({
      success: true,
      count: publicProperties.length,
      properties: publicProperties,
    });
  } catch (error) {
    console.error("Get properties error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch properties",
      error: error.message,
    });
  }
};

// ==========================================
// GET SINGLE PROPERTY
// PUBLIC INFORMATION ONLY
// ==========================================

export const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(
      req.params.id
    ).select(
      "title description location area propertyType viewingFee price deposit water balcony kitchen floor bedrooms bathrooms furnished featured amenities images available createdAt"
    );

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    const propertyObject = property.toObject();

    // ------------------------------------------
    // Only expose the main image publicly
    // ------------------------------------------

    propertyObject.images = property.images?.length
      ? [property.images[0]]
      : [];

    // ------------------------------------------
    // Explicitly remove protected information
    // ------------------------------------------

    delete propertyObject.videos;
    delete propertyObject.mapUrl;
    delete propertyObject.landlordName;
    delete propertyObject.landlordPhone;
    delete propertyObject.landlordEmail;
    delete propertyObject.caretakerName;
    delete propertyObject.caretakerPhone;

    return res.status(200).json({
      success: true,
      property: propertyObject,
    });
  } catch (error) {
    console.error(
      "Get property by ID error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch property",
      error: error.message,
    });
  }
};

// ==========================================
// GET PROTECTED PROPERTY INFORMATION
// PAYMENT REQUIRED
// ==========================================

export const getProtectedProperty = async (
  req,
  res
) => {
  try {
    const propertyId = req.params.id;
    const { paymentId } = req.query;

    // ------------------------------------------
    // Validate payment ID
    // ------------------------------------------

    if (!paymentId) {
      return res.status(401).json({
        success: false,
        message: "Payment ID is required",
      });
    }

    // ------------------------------------------
    // Verify completed payment belongs
    // to this property
    // ------------------------------------------

    const payment = await Payment.findOne({
      _id: paymentId,
      property: propertyId,
      status: "completed",
    });

    if (!payment) {
      return res.status(403).json({
        success: false,
        message:
          "Valid completed property viewing payment not found",
      });
    }

    // ------------------------------------------
    // Find property
    // ------------------------------------------

    const property = await Property.findById(
      propertyId
    );

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    // ------------------------------------------
    // Return protected information
    // ------------------------------------------

    return res.status(200).json({
      success: true,
      message:
        "Property information unlocked",

      protectedDetails: {
        // All images after payment
        images: property.images || [],

        // Videos
        videos: property.videos || [],

        // Map / exact location information
        mapUrl: property.mapUrl,

        // Landlord
        landlordName:
          property.landlordName,

        landlordPhone:
          property.landlordPhone,

        landlordEmail:
          property.landlordEmail,

        // Caretaker
        caretakerName:
          property.caretakerName,

        caretakerPhone:
          property.caretakerPhone,
      },
    });
  } catch (error) {
    console.error(
      "Get protected property error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch protected property information",
      error: error.message,
    });
  }
};

// ==========================================
// UPDATE PROPERTY
// ==========================================

export const updateProperty = async (
  req,
  res
) => {
  try {
    const property =
      await Property.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Property updated successfully",
      property,
    });
  } catch (error) {
    console.error(
      "Update property error:",
      error
    );

    return res.status(400).json({
      success: false,
      message: "Failed to update property",
      error: error.message,
    });
  }
};

// ==========================================
// DELETE PROPERTY
// ==========================================

export const deleteProperty = async (
  req,
  res
) => {
  try {
    const property =
      await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    await Property.findByIdAndDelete(
      req.params.id
    );

    return res.status(200).json({
      success: true,
      message: "Property deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete property error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to delete property",
      error: error.message,
    });
  }
};