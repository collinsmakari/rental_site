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
      index: true,
    },

    // ==========================================
    // CUSTOMER
    // ==========================================

    phoneNumber: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 1,
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
      index: true,
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

// =====================================================
// M-PESA CHECKOUT REQUEST INDEX
// =====================================================
//
// Every actual M-Pesa transaction gets its own
// CheckoutRequestID.
//
// sparse:true means documents where the value is null
// are not included in the unique index.
//
// This allows many newly-created pending payments
// before Safaricom returns their CheckoutRequestID.
//
// =====================================================

paymentSchema.index(
  { checkoutRequestId: 1 },
  {
    unique: true,
    sparse: true,
  }
);

// =====================================================
// DUPLICATE PAYMENT LOOKUP
// =====================================================
//
// Used to quickly find a recent pending payment for
// the SAME customer + SAME property.
//
// This does NOT prevent different customers from
// paying different properties simultaneously.
//
// =====================================================

paymentSchema.index({
  property: 1,
  phoneNumber: 1,
  status: 1,
  createdAt: -1,
});

// =====================================================
// MODEL
// =====================================================

const Payment = mongoose.model(
  "Payment",
  paymentSchema
);

export default Payment;