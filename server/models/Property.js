import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    // ==========================================
    // PUBLIC INFORMATION
    // ==========================================

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    area: {
      type: Number,
      required: true,
      min: 0,
    },

    propertyType: {
      type: String,
      required: true,
      enum: [
        "Apartment",
        "House",
        "Bedsitter",
        "Studio",
        "Maisonette",
        "Commercial",
        "Office",
        "AirBnB",
      ],
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    deposit: {
      type: Number,
      required: true,
      min: 0,
    },

    // ==========================================
    // VIEWING FEE
    // ==========================================

    // This value is determined by the backend
    // according to propertyType.
    viewingFee: {
      type: Number,
      required: true,
      min: 1,
    },

    bedrooms: {
      type: Number,
      default: 0,
      min: 0,
    },

    bathrooms: {
      type: Number,
      default: 0,
      min: 0,
    },

    furnished: {
      type: Boolean,
      default: false,
    },

    featured: {
      type: Boolean,
      default: false,
    },

    amenities: {
      type: [String],
      default: [],
    },

    // Main/public images
    images: {
      type: [String],
      default: [],
    },

    // ==========================================
    // PROTECTED INFORMATION
    // ==========================================

    videos: {
      type: [String],
      default: [],
    },

    mapUrl: {
      type: String,
      default: "",
      trim: true,
    },

    landlordName: {
      type: String,
      default: "",
      trim: true,
    },

    landlordPhone: {
      type: String,
      default: "",
      trim: true,
    },

    landlordEmail: {
      type: String,
      default: "",
      trim: true,
      lowercase: true,
    },

    caretakerName: {
      type: String,
      default: "",
      trim: true,
    },

    caretakerPhone: {
      type: String,
      default: "",
      trim: true,
    },

    // ==========================================
    // AVAILABILITY
    // ==========================================

    available: {
      type: Boolean,
      default: true,
    },

    // ==========================================
    // APPROVAL STATUS
    // ==========================================

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true,
    },

    // ==========================================
    // REJECTION INFORMATION
    // ==========================================

    rejectionReason: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Property = mongoose.model(
  "Property",
  propertySchema
);

export default Property;