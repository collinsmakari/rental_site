import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    // ==========================================
    // PROPERTY
    // ==========================================

    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },

    // ==========================================
    // CUSTOMER
    // ==========================================

    phoneNumber: {
      type: String,
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    // ==========================================
    // PAYMENT STATUS
    // ==========================================

    status: {
      type: String,
      enum: [
        "pending",
        "completed",
        "failed",
      ],
      default: "pending",
    },

    // ==========================================
    // M-PESA INFORMATION
    // ==========================================

    merchantRequestId: {
      type: String,
      default: null,
      index: true,
    },

    checkoutRequestId: {
      type: String,
      default: null,
      index: true,
    },

    mpesaReceiptNumber: {
      type: String,
      default: null,
    },

    transactionDate: {
      type: String,
      default: null,
    },

    resultCode: {
      type: Number,
      default: null,
    },

    resultDescription: {
      type: String,
      default: null,
    },

    // ==========================================
    // PROPERTY VIEWING ACCESS
    // ==========================================

    accessToken: {
      type: String,
      default: null,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const Payment = mongoose.model(
  "Payment",
  paymentSchema
);

export default Payment;
