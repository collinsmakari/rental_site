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
        "AirBnB",
      ],
    },

    monthlyrent: {
      type: Number,
      required: true,
    },
    deposit: {
      type: Number,
      required: true,
    },

    viewingFee: {
  type: Number,
  required: true,
  min: 1,
},

    bedrooms: {
      type: Number,
      default: 0,
    },

    bathrooms: {
      type: Number,
      default: 0,
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

    // Main/public image
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
    },

    landlordName: {
      type: String,
      default: "",
    },

    landlordPhone: {
      type: String,
      default: "",
    },

    landlordEmail: {
      type: String,
      default: "",
    },

    caretakerName: {
      type: String,
      default: "",
    },

    caretakerPhone: {
      type: String,
      default: "",
    },

    // ==========================================
    // AVAILABILITY
    // ==========================================

    available: {
      type: Boolean,
      default: true,
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
