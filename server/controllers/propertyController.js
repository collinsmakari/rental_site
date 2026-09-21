import Property from "../models/Property.js";
import Payment from "../models/Payment.js";
import viewingFees from "../config/viewingFees.js";

import {
  uploadPropertyImage,
  uploadPropertyVideo,
} from "../services/cloudinaryService.js";

// ==========================================
// CREATE PROPERTY
// LANDLORD / CARETAKER SUBMISSION
// ==========================================

export const createProperty = async (req, res) => {
  try {
    console.log("=================================");
    console.log("CREATE PROPERTY REQUEST RECEIVED");
    console.log("=================================");

    const {
      title,
      description,
      location,
      area,
      propertyType,
      monthlyrent,
      deposit,
      bedrooms,
      bathrooms,
      furnished,
      featured,
      amenities,
      mapUrl,
      landlordName,
      landlordPhone,
      landlordEmail,
      caretakerName,
      caretakerPhone,
      available,
    } = req.body;

    console.log("Property title:", title);
    console.log("Property type:", propertyType);
    console.log("Files received:", req.files);

    // ------------------------------------------
    // Validate property type
    // ------------------------------------------

    if (!propertyType) {
      return res.status(400).json({
        success: false,
        message: "Property type is required",
      });
    }

    // ------------------------------------------
    // Automatically determine viewing fee
    // ------------------------------------------

    const viewingFee = viewingFees[propertyType];

    console.log("Viewing fee:", viewingFee);

    if (!viewingFee) {
      return res.status(400).json({
        success: false,
        message: `No viewing fee configured for property type: ${propertyType}`,
      });
    }

    // ------------------------------------------
    // Get uploaded files
    // ------------------------------------------

    const imageFiles = req.files?.images || [];
    const videoFiles = req.files?.videos || [];

    console.log("Number of images:", imageFiles.length);
    console.log("Number of videos:", videoFiles.length);

    // ------------------------------------------
    // Require at least one image
    // ------------------------------------------

    if (imageFiles.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please upload at least one property image",
      });
    }

    // ------------------------------------------
    // Upload images to Cloudinary
    // ------------------------------------------

    console.log("=================================");
    console.log("STARTING IMAGE UPLOADS");
    console.log("=================================");

    const imageUrls = [];

    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i];

      console.log(
        `Uploading image ${i + 1}/${imageFiles.length}`
      );

      console.log("Filename:", file.originalname);
      console.log("Mimetype:", file.mimetype);
      console.log("Size:", file.size);

      const result = await uploadPropertyImage(
        file.buffer
      );

      console.log(
        `Image ${i + 1} uploaded successfully`
      );

      console.log("Cloudinary URL:", result?.secure_url);

      if (result?.secure_url) {
        imageUrls.push(result.secure_url);
      }
    }

    console.log("Total uploaded images:", imageUrls.length);

    // ------------------------------------------
    // Upload videos to Cloudinary
    // ------------------------------------------

    const videoUrls = [];

    for (let i = 0; i < videoFiles.length; i++) {
      const file = videoFiles[i];

      console.log(
        `Uploading video ${i + 1}/${videoFiles.length}`
      );

      console.log("Filename:", file.originalname);
      console.log("Mimetype:", file.mimetype);
      console.log("Size:", file.size);

      const result = await uploadPropertyVideo(
        file.buffer
      );

      console.log(
        `Video ${i + 1} uploaded successfully`
      );

      console.log("Cloudinary URL:", result?.secure_url);

      if (result?.secure_url) {
        videoUrls.push(result.secure_url);
      }
    }

    console.log("Total uploaded videos:", videoUrls.length);

    // ------------------------------------------
    // Make sure image upload succeeded
    // ------------------------------------------

    if (imageUrls.length === 0) {
      return res.status(500).json({
        success: false,
        message: "Property images could not be uploaded",
      });
    }

    // ------------------------------------------
    // Create MongoDB property
    // ------------------------------------------

    console.log("=================================");
    console.log("CREATING PROPERTY IN MONGODB");
    console.log("=================================");

    const property = await Property.create({
      title,
      description,
      location,
      area,
      propertyType,
      monthlyrent,
      deposit,

      // Automatically assigned
      viewingFee,

      bedrooms,
      bathrooms,

      furnished:
        furnished === true ||
        furnished === "true",

      featured:
        featured === true ||
        featured === "true",

      amenities:
        typeof amenities === "string"
          ? amenities
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean)
          : amenities || [],

      // Cloudinary URLs
      images: imageUrls,
      videos: videoUrls,

      mapUrl,

      landlordName,
      landlordPhone,
      landlordEmail,

      caretakerName,
      caretakerPhone,

      available:
        available === undefined
          ? true
          : available === true ||
            available === "true",

      // Requires admin approval
      status: "pending",
    });

    // ------------------------------------------
    // SUCCESS
    // ------------------------------------------

    console.log("=================================");
    console.log("PROPERTY CREATED SUCCESSFULLY");
    console.log("=================================");
    console.log("Property ID:", property._id.toString());
    console.log("Property Type:", property.propertyType);
    console.log("Viewing Fee:", property.viewingFee);
    console.log("Images:", property.images.length);
    console.log("Videos:", property.videos.length);
    console.log("Status:", property.status);
    console.log("=================================");

    return res.status(201).json({
      success: true,
      message:
        "Property submitted successfully and is awaiting approval",
      property,
    });
  } catch (error) {
    console.error("=================================");
    console.error("CREATE PROPERTY FAILED");
    console.error("=================================");
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);

    if (error.response) {
      console.error(
        "Error response:",
        error.response.data
      );
    }

    console.error("=================================");

    return res.status(500).json({
      success: false,
      message: "Failed to create property",
      error:
        error.message ||
        "Unknown server error",
    });
  }
};

// ==========================================
// GET ALL PROPERTIES
// PUBLIC INFORMATION ONLY
// ==========================================

export const getProperties = async (req, res) => {
  try {
    const properties = await Property.find({
      status: "approved",
    })
      .select(
        "title description location area propertyType monthlyrent deposit viewingFee bedrooms bathrooms furnished featured amenities images available createdAt"
      )
      .sort({
        createdAt: -1,
      });

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
    const property = await Property.findOne({
      _id: req.params.id,
      status: "approved",
    }).select(
      "title description location area propertyType monthlyrent deposit viewingFee bedrooms bathrooms furnished featured amenities images available createdAt"
    );

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    const propertyObject = property.toObject();

    propertyObject.images = property.images?.length
      ? [property.images[0]]
      : [];

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

    if (!paymentId) {
      return res.status(401).json({
        success: false,
        message: "Payment ID is required",
      });
    }

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

    const property = await Property.findOne({
      _id: propertyId,
      status: "approved",
    });

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Property information unlocked",

      protectedDetails: {
        images: property.images || [],
        videos: property.videos || [],
        mapUrl: property.mapUrl,

        landlordName: property.landlordName,
        landlordPhone: property.landlordPhone,
        landlordEmail: property.landlordEmail,

        caretakerName: property.caretakerName,
        caretakerPhone: property.caretakerPhone,
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
    const updates = {
      ...req.body,
    };

    // Never allow frontend to manually change
    // the viewing fee.

    if (updates.propertyType) {
      const viewingFee =
        viewingFees[updates.propertyType];

      if (!viewingFee) {
        return res.status(400).json({
          success: false,
          message:
            `No viewing fee configured for property type: ${updates.propertyType}`,
        });
      }

      updates.viewingFee = viewingFee;
    }

    // Status should be controlled separately
    // by the admin approval system.

    delete updates.status;

    const property =
      await Property.findByIdAndUpdate(
        req.params.id,
        updates,
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